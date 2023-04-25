const JWTServices = require('./jwtServices');
const { MAX_DEVICE_AMOUNT } = require('../constants');

module.exports.createSession = async (user) => {
  const tokenPair = await JWTServices.createTokenPair(user);
  if ((await user.countRefreshTokens()) > MAX_DEVICE_AMOUNT) {
    const [oldestToken] = await user.getRefreshTokens({
      order: [['createdAt', 'DESC']],
    });
    await oldestToken.update({ value: tokenPair.refresh });
  } else {
    await user.createRefreshToken({ value: tokenPair.refresh });
  }
  user.password = undefined;
  return { user, tokenPair };
};

module.exports.refreshSession = async (refreshToken) => {
  const user = await refreshToken.getUser();
  const tokenPair = await JWTServices.createTokenPair(user);
  await refreshToken.update({ value: tokenPair.refresh });
  user.password = undefined;
  return { user, tokenPair };
};
