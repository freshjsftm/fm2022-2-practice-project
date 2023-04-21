const { User } = require('../models');
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
    if(user && (await user.comparePassword(password))){
    //create pair tokens
    //send user with pair tokens      
      res.status(200).send()
    }
    //if not found - error
    //!!!!! createError
    res.status(409).send() 
  } catch (error) {
    next(error);
  }
};

module.exports.signUp = async (req, res, next) => {
  try {
    await User.create()
  } catch (error) {
    next(error);
  }
};

module.exports.refresh = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
