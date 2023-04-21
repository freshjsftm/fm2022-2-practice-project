const express = require('express');
const AuthController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/sign-in', AuthController.signIn);
authRouter.post('/sign-up', AuthController.signUp);
authRouter.post('/refresh', AuthController.refresh);

module.exports = authRouter;
