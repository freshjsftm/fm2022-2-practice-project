const express = require('express');
const AuthController = require('../controllers/authController');
const validators = require('../middlewares/validators');
const { checkRefreshToken } = require('../middlewares/tokenMw');

const authRouter = express.Router();

authRouter.post('/sign-in', validators.validateLogin, AuthController.signIn);
authRouter.post(
  '/sign-up',
  validators.validateRegistrationData,
  AuthController.signUp
);
authRouter.post('/refresh',checkRefreshToken, AuthController.refresh);

module.exports = authRouter;
