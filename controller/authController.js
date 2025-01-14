const sequelize = require('../config/db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { DataTypes } = require('sequelize');
const User = require("../models/user")(sequelize,DataTypes);

exports.login = async (req, reply) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return reply.status(400).send({ error: "Email and password are required." });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {

            await bcrypt.compare(password || User.password);
            return reply.status(401).send({ error: "Invalid passworrds." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return reply.status(401).send({ error: "Invalid passwords." });
        }


        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured.");
        }
        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "6h" }
        );


        reply.status(200).send({
            message: "Login successful.",
            token,
        });
    } catch (err) {
        console.error("Login error:", err);
        reply.status(500).send({ error: "An error occurred while processing your request." });
    }
};

