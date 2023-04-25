const { promisify } = require('util');
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const { User, RefreshToken } = require('../models');
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_TIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_TIME,
  MAX_DEVICE_AMOUNT,
} = require('../constants');

const signJWT = promisify(jwt.sign);

module.exports.signIn = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req;
    //find user
    const user = await User.findOne({
      where: { email },
    });
    //if found - compare password
    if (user && (await user.comparePassword(password))) {
      //create pair tokens
      const accessToken = await signJWT(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_TIME,
        }
      );
      const refreshToken = await signJWT(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: REFRESH_TOKEN_TIME,
        }
      );
      // 3 device
      if ((await user.countRefreshTokens()) > MAX_DEVICE_AMOUNT) {
        const [oldestToken] = await user.getRefreshTokens({
          order: [['createdAt', 'DESC']],
        });
        await oldestToken.update({ value: refreshToken });
      } else {
        await user.createRefreshToken({ value: refreshToken });
      }
      user.password = undefined;
      //send user with pair tokens
      res
        .status(200)
        .send({ data: { user, tokenPair: { accessToken, refreshToken } } });
    }
    next(createHttpError(401, 'Invalid credentials!'));
  } catch (error) {
    next(error);
  }
};

module.exports.signUp = async (req, res, next) => {
  try {
    const {body} = req;
    const user = await User.create(body);
    if (user) {
      //create pair tokens
      const accessToken = await signJWT(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_TIME,
        }
      );
      const refreshToken = await signJWT(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: REFRESH_TOKEN_TIME,
        }
      );
      // 3 device
      if ((await user.countRefreshTokens()) > MAX_DEVICE_AMOUNT) {
        const [oldestToken] = await user.getRefreshTokens({
          order: [['createdAt', 'DESC']],
        });
        await oldestToken.update({ value: refreshToken });
      } else {
        await user.createRefreshToken({ value: refreshToken });
      }
      user.password = undefined;
      //send user with pair tokens
      res
        .status(201)
        .send({ data: { user, tokenPair: { accessToken, refreshToken } } });
    }
    next(createHttpError(400, 'Bad request!'));
  } catch (error) {
    next(error);
  }
};

module.exports.refresh = async (req, res, next) => {
  try {
    const {body: {refreshToken}} = req;
    const refreshTokenInstance = await RefreshToken.findOne({
      where: {value: refreshToken}
    })
    const user = await refreshTokenInstance.getUser();
    // const user = await User.findOne({
    //   where: {id: refreshTokenInstance.userId}
    // })
    const accessToken = await signJWT(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TIME,
      }
    );
    const refreshTokenNew = await signJWT(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_TIME,
      }
    );
    await refreshTokenInstance.update({ value: refreshTokenNew });
    res
        .status(200)
        .send({ data: { user, tokenPair: { accessToken, refreshTokenNew } } });
  } catch (error) {
    next(error);
  }
};
