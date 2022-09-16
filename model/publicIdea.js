const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const publicIdea = sequelize.define("publicIdea", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = publicIdea;
