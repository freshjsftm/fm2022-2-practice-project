const createError = require('http-errors');
const JWTServices = require('../services/jwtServices');

module.exports.checkAccessToken = async (req, res, next) => {
  try {
    const {
      headers: { autorization },
    } = req;
    if (autorization) {
      const [, accessToken] = autorization.split(' ');
      req.tokenData = await JWTServices.verifyAccessToken(accessToken);
      next();
    }
    next(createError(401, 'Need token'));
  } catch (error) {
    next(error);
  }
};

module.exports.checkRefreshToken = async (req, res, next) => {
  try {
    const {
      body: { refreshToken },
    } = req;
    req.tokenData = await JWTServices.verifyRefreshToken(refreshToken);
    next();
  } catch (error) {
    next(error);
  }
};
