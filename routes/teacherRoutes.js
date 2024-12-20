const { authenticate, authorizeRole } = require('../Middleware/adminauth');  
const courseController = require('../controller/courseController');  

module.exports = async function (fastify) {

fastify.addHook('preHandler', authenticate);  
fastify.post('/teacher/courses', { preHandler: authorizeRole(['teacher']) }, courseController.createCourse);
fastify.get('/teacher/courses', { preHandler: authorizeRole(['teacher']) }, courseController.getAllCourses);
fastify.put('/teacher/courses/:id', { preHandler: authorizeRole(['teacher']) }, courseController.updateCourse);
fastify.delete('/teacher/courses/:id', { preHandler: authorizeRole(['teacher']) }, courseController.deleteCourse);
};