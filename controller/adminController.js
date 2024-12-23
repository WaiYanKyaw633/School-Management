const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Course = require('../models/course');
const User = require('../models/user'); 
const sequelize = require('sequelize');




module.exports.createStudent = async (req, reply) => {
    try { 
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await User.create({ name, email, password: hashedPassword, role: "student" });
        reply.send(student);
    } catch (err) {
        reply.code(500).send({ status: false, error: err.message, message: "Failed to create student" });
    }
};

module.exports.createTeacher = async (req, reply) => {
    try { 
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const teacher = await User.create({ name, email, password: hashedPassword, role: "teacher" });
        reply.send(teacher);
    } catch (err) {
        reply.code(500).send({ status: false, error: err.message, message: "Failed to create teacher" });
    }
};

module.exports.UpdateUser = async (req, reply) => {
    try {
        const { id } = req.params;  
        const { name, email, password, role } = req.body;  
        if (email) {
            const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
            if (existingUser) {
                return reply.code(400).send({ message: "Email is already taken by another user." });
            }
        }
        if (role !=='student' && role !== 'teacher') {
            return reply.code(400).send({message: " Choose Student Or Teacher"});
           }
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = hashedPassword;
        if (role) updateData.role = role;

        const updatedUser = await User.update(
            updateData,
            { where: { id } }
        );
         if (updatedUser === 0) {
            return reply.code(404).send({ message: "User not found" });
        }
        const updatedUserData = await User.findByPk(id);
        reply.send({ message: "User updated successfully", user: updatedUserData });
        } catch (err) {
        console.error("Error during user update:", err);
        reply.code(500).send({ status: false, error: err.message, message: "Failed to update user" });
    }
};

module.exports.deleteUser = async (req, reply) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            console.log(`User with ID ${id} not found.`);
            return reply.code(404).send({ message: "User not found" });
        }
        console.log(`User found:`, user);
        await User.destroy({ where: { id } });
        console.log(`User with ID ${id} deleted successfully.`);
        reply.send({ message: "User deleted successfully" });

    } catch (err) {
        console.error("Error during user deletion:", err);
         reply.code(500).send({
            status: false,
            error: err.message,
            message: "Failed to delete user"
        });
    }
};

module.exports.updateCourse = async (req, reply) => {
    try {
      const { id } = req.params;
      const { name, description, teacherId } = req.body;
      if (teacherId) {
        const teacher = await User.findByPk(teacherId);
        if (!teacher || teacher.role !== "teacher") {
          return reply.code(400).send({ status: false, message: "Invalid teacher ID" });
        }
      }
  
      const updateData = { name, description, teacherId };

      const [updatedRows] = await Course.update(updateData, { where: { id } });
      if (updatedRows === 0) {
        return reply.code(404).send({ status: false, message: "Course not found" });
      }
  
      const updatedCourse = await Course.findByPk(id);
      reply.send({ status: true, message: "Course updated successfully", data: updatedCourse });
    } catch (err) {
      console.error("Error during course update:", err);
      reply.code(500).send({ status: false, error: err.message, message: "Failed to update course" });
    }
  };