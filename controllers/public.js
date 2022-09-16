const publicIdea = require("../model/publicIdea");
const publicList = require("../model/publicList");
const idea = require("../model/idea");
module.exports.getPublicIdeas = (req, res, next) => {};

exports.postPublicIdea = (req, res, next) => {
  let savedIdea;
  return idea.findOne({ where: { id: req.params.id } }).then((ide) => {
    savedIdea = ide;

    publicList
      .findAll()
      .then((pl_) => {
        let pl = pl_[0];

        if (savedIdea.userId.toString() !== req.user.id.toString()) {
          req.flash("errorMessage", "You can modify yours ideas only!");
          return res.redirect("/");
        }
        pl.addIdea(savedIdea);
        //,{through:{userId: savedIdea.userId}}
      })
      .then(() => {
        res.redirect("/public/list");
      });
  });
};

exports.getPublicIdeas = (req, res, next) => {
  publicList.findAll().then((pl_) => {
    let pl = pl_[0];
    pl.getIdeas().then((ideas_) => {
      console.log(ideas_);
      res.render("publicList", {
        ideas: ideas_,
        isAuth: req.session.isLoggedIn,
        errors: req.flash("errorMessage"),
      });
    });
  });
};

exports.delete = (req, res, next) => {
  let u = req.user;

  publicList
    .findAll()
    .then((pl_) => {
      let pl = pl_[0];

      return pl.getIdeas({ where: { userId: u.id, Id: req.params.id } });
    })
    .then((pIdeas_) => {
      let pIdea = pIdeas_[0];

      if (!pIdea) {
        req.flash("errorMessage", "You can modify yours ideas only!");
        return res.redirect("/");
      }
      return pIdea.publicIdea.destroy();
    })
    .then(() => {
      res.redirect("/public/list");
    });
};
