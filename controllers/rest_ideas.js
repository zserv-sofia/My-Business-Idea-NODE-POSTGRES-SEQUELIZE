const path = require("path");
const idea = require("../model/idea");
const user = require("../model/user");
//
exports.listIdeas = (req, res, next) => {
  let u = req.user;
  u.getIdeas().then((ideas_) => {

res.status(201).json({ideas_})
  });
};
//
exports.addIdea = (req, res, next) => {

  let u = req.user;
  u.createIdea({
    title: req.body.title,
    description: req.body.descr,
  }).then(() => {
    res.status(201).json({message: "An idea has been added!"});
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
      res.status(201).json(
       {
        idea: idea_by_id[0],
      });
    });
};
// 
exports.delete = (req, res, next) => {


  idea
    .findAll({ where: { id: req.params.id } })
    .then((idea_by_id) => {
      if (idea_by_id[0].userId.toString() !== req.user.id.toString()) {
        return res.status(401).json({message: "You can modify yours ideas only!"})
      }
      return idea_by_id[0].destroy();
    })
    .then(() => {
      res.status(201).json({message: "An idea has been deleted!"});
    });
    
    
}
