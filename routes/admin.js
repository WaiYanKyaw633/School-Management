const { authenticate, authorizeRole } = require('../Middleware/adminauth');  
const adminController = require('../controller/adminController');  

module.exports = async function (fastify) {

fastify.addHook('preHandler', authenticate);  
fastify.post('/admin/courses', { preHandler: authorizeRole(['admin']) }, adminController.createCourse);
fastify.get('/admin/courses', { preHandler: authorizeRole(['admin']) }, adminController.getCourses);
fastify.post('/admin/students', { preHandler: authorizeRole(['admin']) }, adminController.createStudent); 
fastify.post('/admin/teachers', { preHandler: authorizeRole(['admin']) }, adminController.createTeacher);
};
