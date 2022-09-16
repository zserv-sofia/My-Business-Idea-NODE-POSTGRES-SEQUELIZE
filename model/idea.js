const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const idea = sequelize.define("idea", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: Sequelize.STRING },
  description: { type: Sequelize.TEXT },
});

module.exports = idea;
