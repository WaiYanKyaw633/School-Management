const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const User = require("./user")(sequelize, DataTypes);
const Course = require("./course")(sequelize, DataTypes);


const Enrollment = sequelize.define('enrollCourse', {});

User.hasMany(Course, { foreignKey: 'teacherId' });
Course.belongsTo(User, { foreignKey: 'teacherId' });

User.belongsToMany(Course, { through: Enrollment, as: 'enrolledCourses', foreignKey: 'UserId' });
Course.belongsToMany(User, { through: Enrollment, as: 'students', foreignKey: 'CourseId' });

Enrollment.belongsTo(Course, { foreignKey: 'CourseId' });
Enrollment.belongsTo(User, { foreignKey: 'UserId' });

module.exports = { sequelize, User, Course, Enrollment };