const path = require("path");

exports.addIdea = (req, res, next) => {
  res.render("addIdea.ejs", { isAuth: req.session.isLoggedIn });
};

exports.about = (req, res, next) => {
  res.render("about", { isAuth: req.session.isLoggedIn });
};

