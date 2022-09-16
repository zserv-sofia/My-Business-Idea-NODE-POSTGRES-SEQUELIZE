const express = require("express");
const bodyParser=require('body-parser')
const manage = require("../controllers/manage");
const ideas = require("../controllers/ideas");
const favorites = require("../controllers/favorites");
const authentication = require("../controllers/authentication");
const rest_authentication = require("../controllers/rest_authentication");
const public = require("../controllers/public");
const isAuth = require("../middleware/isAuth");
const { check } = require("express-validator/check");
const restAuth=require('../middleware/restAuth')
const restIdeas=require('../controllers/rest_ideas')
const restPubic=require('../controllers/rest_public')
const restFavorites=require('../controllers/rest_favorites')

const user = require("../model/user");


const router = express.Router();

router.use(bodyParser.urlencoded());
//app.use(bodyParser.json())

router.get("/add-idea", isAuth, manage.addIdea);
router.post("/add-idea", ideas.addIdea);
router.get("/idea/details/:id", ideas.ideaDetails);
router.get("/idea/edit/:id", isAuth, ideas.ideaEdit);
router.post("/idea/edited-save", ideas.editedSave);
router.get("/idea/delete/:id", isAuth, ideas.delete);
router.get("/ideas", isAuth, ideas.listIdeas);
router.get("/", (req, res, next) => {
  res.redirect("/about");
});
router.get("/addFav/:id", isAuth, favorites.addFavorite);
router.get("/favorites", isAuth, favorites.listFavorites);
router.get("/delFav/:id", isAuth, favorites.delete);



router.get("/auth/login", authentication.getLogin);
router.post("/auth/login", authentication.postLogin);


router.get("/auth/logout", authentication.getLogout);


router.get("/auth/signup", authentication.getSignUp);
router.post(
  "/auth/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid E-Mail"),
    check("pass")
      .isLength({ min: 6 })
      .withMessage(
        "Please enter a password with numbers and text only, 6 characters minimum "
      )
      .isAlphanumeric(),
    check("repass").custom((value, { req }) => {
      if (value !== req.body.pass) {
        throw new Error("Passwords have to match");
      }
      return true;
    }),
  ],
  authentication.postSignUp
);


  
router.get("/public/post/:id", isAuth, public.postPublicIdea);
router.get("/public/remove/:id", isAuth, public.delete);

router.get("/public/list", public.getPublicIdeas);


router.get('/about', manage.about );

//router.use(bodyParser.urlencoded());
router.use(bodyParser.json())

router.post("/rest/auth/login", rest_authentication.postLogin);
router.post("/rest/auth/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid E-Mail"),
    check("pass")
      .isLength({ min: 6 })
      .withMessage(
        "Please enter a password with numbers and text only, 6 characters minimum "
      )
      .isAlphanumeric(),
    check("repass").custom((value, { req }) => {
      if (value !== req.body.pass) {
        throw new Error("Passwords have to match");
      }
      return true;
    }),
  ],
  rest_authentication.postSignUp
);

router.get("/rest/public/list", restPubic.getPublicIdeas);

// rest auth access only
router.use(restAuth);

router.use((req, res, next) => {
  
  if (!req.userData) {
    console.log("no userData" )
    return next();
  }

  console.log("rcff_user_id "+req.userData.userId )
  user.findAll({ where: { id: req.userData.userId } }).then((user_) => {
    req.user = user_[0];
    console.log(user_[0])
    next();
  });
});

router.get("/rest/auth/logout", rest_authentication.getLogout);
//
router.post("/rest/add-idea", restIdeas.addIdea);
router.post("/rest/idea/edited-save", restIdeas.editedSave);
router.get("/rest/idea/delete/:id", restIdeas.delete);
router.get("/rest/ideas", restIdeas.listIdeas);


router.get("/rest/public/post/:id", restPubic.postPublicIdea);
router.get("/rest/public/remove/:id", restPubic.delete);

router.get("/rest/addFav/:id", restFavorites.addFavorite );
router.get("/rest/favorites", restFavorites.listFavorites);
router.get("/rest/delFav/:id", restFavorites.delete);

module.exports = router;
