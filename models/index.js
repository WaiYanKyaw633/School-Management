const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Course = require('./course')(sequelize, DataTypes);
const Teacher = require('./teacher')(sequelize, DataTypes);

Course.belongsTo(Teacher, { foreignKey: 'teacherId' });
Teacher.hasMany(Course, { foreignKey: 'teacherId' });

module.exports = { sequelize, Course, Teacher };
