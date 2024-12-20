const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Course = require('../models/course');
const User = require('../models/user'); 


module.exports.createCourse = async (req, reply) => {
    const { name, description,  } = req.body;
          try {
        const course = await Course.create({
            name,
            description,
            
        });
        reply.code(201).send(course);
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: "Failed to create course" });
    }
};
module.exports.getCourses = async (req, reply) => {
    try {
        const courses = await Course.findAll(); 
        reply.send(courses);
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: "Failed to retrieve courses" });
    }
};

module.exports.createStudent = async (req, reply) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await User.create({ name, email, password: hashedPassword, role: "student" });
    reply.send(student);
};
module.exports.createTeacher = async (req, reply) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = await User.create({ name, email, password: hashedPassword, role: "teacher" });
    reply.send(teacher);
};
