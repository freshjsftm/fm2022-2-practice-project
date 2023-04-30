const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');

module.exports = (err, req, res, next) => {
  console.log(err);
  // if (
  //   err.message ===
  //     'new row for relation "Bank" violates check constraint "Bank_balance_ck"' ||
  //   err.message ===
  //     'new row for relation "User" violates check constraint "User_balance_ck"'
  // ) {
  //   err.message = 'Not Enough money';
  //   err.status = 406;
  // }
  if (err instanceof TokenExpiredError) {
    return res.status(408).send('Token Expired');
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).send('Token Error');
  }

  if (!err.message || !err.status) {
    return res.status(500).send('Server Error');
  }
  return res.status(err.status).send(err.message);
};
