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
   try{ 
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await User.create({ name, email, password: hashedPassword, role: "student" });
    reply.send(student);
}catch(err){
    reply.code(500).send({status:false, error: err, message})
}
};
module.exports.createTeacher = async (req, reply) => {
    try{ 
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = await User.create({ name, email, password: hashedPassword, role: "teacher" });
    reply.send(teacher);
}catch(err){
    reply.code(500).send({status:false, error: err.message})
}
};

module.exports.UpdateUser= async (req,reply) =>{
    try{
        const {id} =req.params;
        const {name, email, password, role} =req.body;
        const hashedPassword=await bcrypt.hash(password, 10);
        const User=await User.update({name, email, password:hashedPassword, role: User.role}, {where:{id}});
        if (User === 0){
            return reply.code(404).send ({message: "User not found"});
        }
        reply.send(User);
    }catch(err){
        reply.code(500).send({status:false, error: err.message});
    }
};
