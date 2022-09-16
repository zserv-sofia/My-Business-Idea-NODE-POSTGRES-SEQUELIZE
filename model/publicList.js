const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const publicList = sequelize.define("publicList", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = publicList;
