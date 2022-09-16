const path = require("path");
const idea = require("../model/idea");
const user = require("../model/user");

exports.listIdeas = (req, res, next) => {
  let u = req.user;
  console.log(u);
  u.getIdeas().then((ideas_) => {
    res.render("listIdeas.ejs", {
      ideas: ideas_,
      isAuth: req.session.isLoggedIn,
    });
  });
};

exports.addIdea = (req, res, next) => {
  let u = req.user;
  u.createIdea({
    title: req.body.title,
    description: req.body.descr,
  }).then(() => {
    res.redirect("/ideas");
  });
};

//
exports.ideaDetails = (req, res, next) => {
  idea.findAll({ where: { id: req.params.id } }).then((idea_by_id) => {
    console.log(idea_by_id[0]);
    res.render("details", {
      idea: idea_by_id[0],
      isAuth: req.session.isLoggedIn,
    });
  });
};
//
exports.ideaEdit = (req, res, next) => {
  idea.findAll({ where: { id: req.params.id } }).then((idea_by_id) => {
    if (idea_by_id[0].userId.toString() !== req.user.id.toString()) {
      req.flash("errorMessage", "You can modify yours ideas only!");
      res.redirect("/");
    }

    res.render("ideaEdit", {
      idea: idea_by_id[0],
      isAuth: req.session.isLoggedIn,
    });
  });
};

//
exports.editedSave = (req, res, next) => {
  idea
    .findAll({ where: { id: req.body.id } })
    .then((idea_by_id) => {
      idea_by_id[0].title = req.body.title;
      idea_by_id[0].description = req.body.description;
      idea_by_id[0].save();
      return idea_by_id;
    })
    .then((idea_by_id) => {
      res.render("details", {
        idea: idea_by_id[0],
        isAuth: req.session.isLoggedIn,
      });
    });
};
// needs to delete from favorites as well
exports.delete = (req, res, next) => {
  idea
    .findAll({ where: { id: req.params.id } })
    .then((idea_by_id) => {
      if (idea_by_id[0].userId.toString() !== req.user.id.toString()) {
        req.flash("errorMessage", "You can modify yours ideas only!");
        return res.redirect("/");
      }
      return idea_by_id[0].destroy();
    })
    .then(() => {
      res.redirect("/ideas");
    });
};
