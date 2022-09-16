const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const favoritesList = sequelize.define("favoritesList", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = favoritesList;
