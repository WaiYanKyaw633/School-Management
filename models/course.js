const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User=require ("./user");

const Course = sequelize.define(
  "Course",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);


module.exports = Course;
