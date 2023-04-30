const createHttpError = require('http-errors');
const { User, RefreshToken } = require('../models');
const { createTokenPair } = require('../services/jwtServices');
const AuthServices = require('../services/authServices');

module.exports.signIn = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req;
    //find user
    const user = await User.findOne({
      where: { email },
    });
    if (user && (await user.comparePassword(password))) {
      const data = await AuthServices.createSession(user);
      return res.status(200).send({ data });
    }
    next(createHttpError(401, 'Invalid credentials!'));
  } catch (error) {
    next(error);
  }
};

module.exports.signUp = async (req, res, next) => {
  try {
    const { body } = req;
    const user = await User.create(body);
    console.log('=====>>>>>>>', user)
    if (user) {
      const data = await AuthServices.createSession(user);
      return res.status(201).send({ data });
    }
    next(createHttpError(400, 'Bad request!'));
  } catch (error) {
    next(error);
  }
};

module.exports.refresh = async (req, res, next) => {
  try {
    const {
      body: { refreshToken },
    } = req;
    const refreshTokenInstance = await RefreshToken.findOne({
      where: { value: refreshToken },
    });
    const data = await AuthServices.refreshSession(refreshTokenInstance);
    res.status(200).send({ data });
  } catch (error) {
    next(error);
  }
};
