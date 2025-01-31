const sequelize = require('../config/db');
const DataTypes = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('../models/user')(sequelize,DataTypes);
const { Op } = require('sequelize');

module.exports.createStudent = async (req, reply) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await User.create({ name, email, password: hashedPassword, role: "student" });
        reply.send({status:true, message: "Student Created Successfully", student });
    } catch (err) {
        reply.code(500).send({ status: false, error: err.message, message: "Failed to create student" });
    }
};

module.exports.createTeacher = async (req, reply) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const teacher = await User.create({ name, email, password: hashedPassword, role: "teacher" });
        reply.send({status:true, message: "Teacher Created Successfully", teacher });
    } catch (err) {
        reply.code(500).send({ status: false, error: err.message, message: "Failed to create teacher" });
    }
};

module.exports.viewUser = async (request, reply) => {
    try {
    const students = await User.findAll({ where: { role: 'student' } });
    const teachers = await User.findAll({ where: { role: 'teacher' } });
        const studentDetails = students.map(student => ({
        Name: student.name,
        Email: student.email,
      }));
        const teacherDetails = teachers.map(teacher => ({
        Name: teacher.name,
        Email: teacher.email,
      }));
  
     const totalCount = studentDetails.length + teacherDetails.length;
     
      return reply.send({
        status: true,
        data: {
            TotalUsers: {
                count: totalCount,            
              },
          Student: {
            count: studentDetails.length, 
            details: studentDetails,       
          },
          Teacher: {
            count: teacherDetails.length,  
            details: teacherDetails,      
          },
          },
      });
    } catch (error) {
      console.error('Error fetching users by role:', error);
      return reply.status(500).send({ message: 'Error fetching users by role' });
    }
  };
  
module.exports.UpdateUser = async (req, reply) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        if (email) {
            const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: id } } });
            if (existingUser) {
                return reply.code(400).send({status:false,message: "Email is already taken by another user." });
            }
        }
      
        const validRole = ['student', 'teacher'];
        if (role && !validRole.includes(role)) {
            return reply.code(400).send({status:false,message: "invalid role: choose student or teacher" });
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
            return reply.code(404).send({status:false,message: "User not found" });
        }
        const updatedUserData = await User.findByPk(id);
        reply.send({status:true,message: "User updated successfully", user: updatedUserData });
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
            return reply.code(404).send({status:false,message: "User not found" });
        }
        console.log(`User found:`, user);
        await User.destroy({ where: { id } });
        console.log(`User with ID ${id} deleted successfully.`);
        reply.send({status:true, message: `User with Id ${id} deleted successfully` });

    } catch (err) {
        console.error("Error during user deletion:", err);
        reply.code(500).send({
            status: false,
            error: err.message,
            message: "Failed to delete user"
        });
    }
};

