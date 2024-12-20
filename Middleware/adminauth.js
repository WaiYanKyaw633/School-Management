const jwt = require("jsonwebtoken");


exports.authenticate = async (request, reply) => {
    try {
        // Get the Authorization header
        const authHeader = request.headers.authorization;
        
        // Check if the Authorization header exists and starts with "Bearer"
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reply.code(401).send({ error: "Authentication token is missing or invalid." });
        }

        // Extract token from the header
        const token = authHeader.split(" ")[1];
        
        // Verify the token using JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to the request object
        request.user = decoded;

        console.log("Authenticated User:", request.user);
    } catch (err) {
        console.error("Authentication error:", err.message);
        reply.code(401).send({ message: "Unauthorized. Invalid or expired token." });
    }
};



exports.authorizeRole = (roles) => async (request, reply) => {
    try {
       if (!request.user || !roles.includes(request.user.role)) {
            return reply.code(403).send({ message: "Forbidden." });
        }
    } catch (err) {
        console.error("Authorization error:", err);
        reply.code(403).send({ message: "Forbidden." });
    }
};
