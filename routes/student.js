const { authenticate, authorizeRole } = require('../Middleware/adminauth');  
const studentController = require('../controller/studentController');  


module.exports = async function (fastify) {
fastify.addHook('preHandler', authenticate); 
fastify.post('/student/enroll', { preHandler: authorizeRole(['student']) },studentController.Enrollment);
fastify.get('/student/availableCourses', { preHandler: authorizeRole(['student']) },studentController.getAllCourse);
fastify.get('/student/registeredCourses', { preHandler: authorizeRole(['student']) },studentController.getAllRegisteredCourse);
fastify.delete('/student/unenroll', { preHandler: authorizeRole(['student']) },studentController.removeRegisteredCourse);

};
