const Sequelize = require("sequelize");
//const sequelize = new Sequelize("sapp", "root", "Krasnoyarsk2012", {
//dialect: "mysql",
//host: "localhost",
//});

sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });




module.exports = sequelize;
