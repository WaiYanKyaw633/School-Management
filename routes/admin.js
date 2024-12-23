const { authenticate, authorizeRole } = require('../Middleware/adminauth');  
const adminController = require('../controller/adminController');  

module.exports = async function (fastify) {

fastify.addHook('preHandler', authenticate);  
fastify.post('/admin/students', { preHandler: authorizeRole(['admin']) }, adminController.createStudent); 
fastify.post('/admin/teachers', { preHandler: authorizeRole(['admin']) }, adminController.createTeacher);
fastify.put('/admin/update/:id', {preHandler:authorizeRole(['admin'])},adminController.UpdateUser);
fastify.delete('/admin/delete/:id', {preHandler:authorizeRole(['admin'])},adminController.deleteUser);

};
