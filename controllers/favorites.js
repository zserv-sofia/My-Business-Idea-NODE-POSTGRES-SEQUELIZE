const favorite = require("../model/favorite");
const favoritesList = require("../model/favoritesList");
const user = require("../model/user");
const idea = require("../model/idea");

exports.addFavorite = (req, res, next) => {
  let fFl;
  let u = req.user;
  u.getFavoritesList()
    .then((fl) => {
      fFl = fl;

      return idea.findAll({ where: { id: req.params.id } });
    })
    .then((ide) => {
      fFl.addIdea(ide);
    })
    .then(() => {
      res.redirect("/favorites");
    });
};

exports.listFavorites = (req, res, next) => {
  let u = req.user;
  u.getFavoritesList()
    .then((fl) => {
      return fl.getIdeas();
    })
    .then((ideas_) => {
      console.log(ideas_);
      res.render("listFavorites", {
        favorites: ideas_,
        isAuth: req.session.isLoggedIn,
      });
    });
};

exports.delete = (req, res, next) => {
  let u = req.user;
  u.getFavoritesList()
    .then((fl) => {
      return fl.getIdeas({ where: { id: req.params.id } });
    })
    .then((ideas_) => {
      let ide = ideas_[0];
      return ide.favorite.destroy();
    })
    .then(() => {
      res.redirect("/favorites");
    });
};
