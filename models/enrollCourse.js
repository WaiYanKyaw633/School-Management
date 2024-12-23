const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const User = require("./user");
const Course = require("./course")(sequelize, DataTypes);

const Enrollment = sequelize.define('enrollCourse', {});


User.hasMany(Course, { foreignKey: 'teacherId' });
Course.belongsTo(User, { foreignKey: 'teacherId' });
User.belongsToMany(Course, { through: Enrollment, as: 'enrolledCourses' });
Course.belongsToMany(User, { through: Enrollment, as: 'students' });

module.exports = {sequelize, User, Course, Enrollment};

