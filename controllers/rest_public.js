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
          return res.status(401).json("You can modify yours ideas only!");
        }
        pl.addIdea(savedIdea);
        //,{through:{userId: savedIdea.userId}}
      })
      .then(() => {
        res.status(201).json('added to pubic');
      });
  });
};
//
exports.getPublicIdeas = (req, res, next) => {
  publicList.findAll().then((pl_) => {
    let pl = pl_[0];
    pl.getIdeas().then((ideas_) => {
     
      res.status(201).json({ideas_})
    });
  });
};

exports.delete = (req, res, next) => {
  let u = req.user;

  publicList
    .findAll()
    .then((pl_) => {
      let pl = pl_[0];

      return pl.getIdeas({ where: { userId: u.id, id: req.params.id } });
    })
    .then((pIdeas_) => {
      let pIdea = pIdeas_[0];

      if (!pIdea) {
        
        return res.status(401).json("You can modify yours ideas only!");
      }
      return pIdea.publicIdea.destroy();
    })
    .then(() => {
      res.status(201).json('deleted from public');
    }).catch((err)=>{
      res.status(401).json({err})});
};
