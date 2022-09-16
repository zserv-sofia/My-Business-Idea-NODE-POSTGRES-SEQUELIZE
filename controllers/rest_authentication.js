const user = require("../model/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/check");
const jwt=require('jsonwebtoken');

module.exports.postLogin = (req, res, next) => {
  console.log("hi there")
  const email_ = req.body.email;
  const password_ = req.body.pass;
  let use;

  user
    .findAll({ where: { eMail: email_ } })
    .then((user_) => {
      use = user_[0];
      
      if (!use) {
       
       return res.status(400).json({errorMessage:'Invalid E-Mail!'});
      }

      return bcrypt.compare(password_, use.password);
    })
    .then((isMatch) => {
      if (!isMatch) {
      
       return res.status(422).json({errorMessage:'Invalid password!'})
      }

      let token;
      token=jwt.sign(
        {email: email_, userId:use.id},
        "pterodaktil",
        {expiresIn: '1h'}
      )
     
      
      res.status(201).json({message:'User logged in', userId: use.id, token: token});
    });
};

module.exports.getLogout = (req, res, next) => {

console.log('user logged out_');
console.log("logout user id: "+req.userData.userId)
res.status(201).json({message:'User has logged out'})
};

module.exports.postSignUp = (req, res, next) => {
  console.log('im from signup comp.')
  const email_ = req.body.email;
  const password_ = req.body.pass;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({errorMessage: errors.array()[0].msg})
  }

  user
    .findOne({ where: { eMail: email_} })
    .then((user_) => {
      if (user_) {
        res.status(422).json({errorMessage: 'E-mail alredy exist!'})
      }
      return bcrypt.hash(password_, 12);
    })
    .then((pwd) => {
      return user.create({ eMail: email_, password: pwd });

    })
    .then((us) => {
     
      us.createFavoritesList();
    })
    .then(() => {
        console.log('user signed up!!! ')
      res.status(201).json({message:'New user has been created!',
    token_: token});;
    }).catch((err)=>{
      res.status(401).json({err})})
}
