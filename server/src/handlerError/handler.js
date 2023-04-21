module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.message ===
    'new row for relation "Bank" violates check constraint "Bank_balance_ck"' ||
    err.message ===
    'new row for relation "User" violates check constraint "User_balance_ck"') {
    err.message = 'Not Enough money';
    err.code = 406;
  }
  if (!err.message || !err.code) {
    res.status(500).send('Server Error');
  } else {
    res.status(err.code).send(err.message);
  }
};
