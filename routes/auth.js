const authController = require("../controller/authController");

module.exports = async function (fastify) {
 fastify.post("/login", authController.login);

};