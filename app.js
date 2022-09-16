const express = require("express");
const ejs = require("ejs");
const eSession = require("express-session");

const router = require("./routes/router");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");

const favoritesList = require("./model/favoritesList");
const favorite = require("./model/favorite");
const idea = require("./model/idea");
const user = require("./model/user");
const publicIdea = require("./model/publicIdea");
const publicList = require("./model/publicList");

const flash = require("connect-flash");
const path=require("path")

const app = express();
app.set("view engine", "ejs");

//app.use(bodyParser.urlencoded());
//app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,'public')))

app.use(
  eSession({ secret: "pterodactil", resave: false, saveUninitialized: false })
);
app.use(flash());

// brouser only
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  user.findAll({ where: { id: req.session.user.id } }).then((user_) => {
    req.user = user_[0];
    next();
  });
});
//


app.use((req, res, next) => {
  publicList.findAll().then((pl) => {
    if (pl[0]) {
  
      return next();
    }
    
    return publicList.create().then((pl) => {
      next();
    });
  });
});

app.use(router);

user.hasMany(idea);

user.hasOne(favoritesList);

favoritesList.belongsToMany(idea, { through: favorite });
//idea.belongsToMany(favoritesList,{through: favorite})

//admin.hasOne(publicList)
publicList.belongsToMany(idea, { through: publicIdea });
publicList.belongsToMany(user, { through: publicIdea });

app.use((req, res, next)=>{
res.setHeader('Access-Control-Allow-Origin','*');
res.setHeader('Access-Control-Allow-Methods', 'GET','POST','PUT','PATCH','DELETE');
res.setHeader('Access-Control-Allow-Headers','Content-Type','Autorization');
next()
})

// {force:true}
sequelize
  .sync()
  .then((result) => {
    console.log("ser",process.env.DATABASE_URL)
    console.log("ser",process.env.PORT)
    app.listen(process.env.PORT ||3000);
  })
  .catch((err) => {
    console.log(err);
  });
