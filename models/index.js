const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Course = require('./course')(sequelize, DataTypes);
const User = require('./user');


Course.belongsTo(User, { foreignKey: 'teacherId' });
User.hasMany(Course, { foreignKey: 'teacherId' });


module.exports = { sequelize, Course, User};
