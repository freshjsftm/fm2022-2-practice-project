const createError = require('http-errors');
const TokenError = require('../errors/TokenError');
const userQueries = require('../controllers/queries/userQueries');
const JWTServices = require('../services/jwtServices');

module.exports.checkAuth = async (req, res, next) => {
  try {
    const {
      headers: { authorization },
    } = req;
    console.log('authorization ==================', authorization);
    if (authorization) {
      const [, accessToken] = authorization.split(' ');
      const tokenData = await JWTServices.verifyAccessToken(accessToken);
      const user = await userQueries.findUser({ id: tokenData.userId });
      delete user.password;
      return res.status(200).send({ data: user });
    }
    next(createError(401, 'Need token'));
  } catch (err) {
    next(new TokenError());
  }
};
