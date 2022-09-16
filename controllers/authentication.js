const user = require("../model/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/check");

module.exports.getLogin = (req, res, next) => {
  res.render("login", {
    isAuth: req.session.isLoggedIn,
    errors: req.flash("errorMessage"),
  });
};

module.exports.postLogin = (req, res, next) => {
  const email_ = req.body.email;
  const password_ = req.body.pass;
  let use;

  user
    .findAll({ where: { eMail: email_ } })
    .then((user_) => {
      use = user_[0];
      if (!use) {
        console.log("user not exist");
        req.flash("errorMessage", "Invalid E-Mail or password");
        return res.redirect("/auth/login");
      }

      return bcrypt.compare(password_, use.password);
    })
    .then((isMatch) => {
      if (!isMatch) {
        req.flash("errorMessage", "Invalid E-Mail or password");
        return res.redirect("/auth/login");
      }

      req.session.user = use;
      req.session.isLoggedIn = true;
      res.redirect("/ideas");
    });
};

module.exports.getLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};

module.exports.getSignUp = (req, res, next) => {
  res.render("signup", {
    isAuth: req.session.isLoggedIn,
    errors: null,
  });
};

module.exports.postSignUp = (req, res, next) => {
  const email_ = req.body.email;
  const password_ = req.body.pass;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("signup", {
      isAuth: req.session.isLoggedIn,
      errors: errors.array()[0].msg,
    });
  }

  user
    .findOne({ where: { eMail: email_ } })
    .then((user_) => {
      if (user_) {
        res.redirect("/auth/signup");
      }
      return bcrypt.hash(password_, 12);
    })
    .then((pwd) => {
      return user.create({ eMail: email_, password: pwd });
    })
    .then((us) => {
      // console.log(us);
      us.createFavoritesList();
    })
    .then(() => {
      res.redirect("/auth/login");
    });
};
