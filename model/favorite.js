const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const favorite = sequelize.define("favorite", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = favorite;
