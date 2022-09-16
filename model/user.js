const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const user = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  eMail: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
});

module.exports = user;
