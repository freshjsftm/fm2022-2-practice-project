const TokenError = require('../errors/TokenError');
const userQueries = require('../controllers/queries/userQueries');
const JWTServices = require('../services/jwtServices');

module.exports.checkAuth = async (req, res, next) => {
  try {
    const {
      headers: { autorization },
    } = req;
    if (autorization) {
      const [, accessToken] = autorization.split(' ');
      const tokenData = await JWTServices.verifyAccessToken(accessToken);
      const user = await userQueries.findUser({ id: tokenData.userId });
      delete user.password;
      res.status(200).send(user);
    }
    next(createError(401, 'Need token'));
  } catch (err) {
    next(new TokenError());
  }
};
