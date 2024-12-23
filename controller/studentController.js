const {User} = require('../models/enrollCourse');
const {Course} = require('../models/enrollCourse');
const {Enrollment} = require('../models/enrollCourse');

module.exports.Enrollment = async (req, reply) => {

    if (!req.user) {
        console.error("User not authenticated.");
        return reply.status(401).send({ message: "User not authenticated." });
    }
    const { courseIds } = req.body;
    const studentId = req.user.id;

    console.log("Enrolling Student ID: ", studentId);
    console.log("Course IDs to enroll: ", courseIds);

    if (!studentId || !courseIds || courseIds.length === 0) {
        console.error("Student ID or Course IDs are missing in the request.");
        return reply.status(400).send({ message: "Student ID and course IDs are required." });
    }

    try {
        for (const courseId of courseIds) {
            console.log(`Checking if Course with ID ${courseId} exists...`);

           
            const courseExists = await Course.findByPk(courseId);
            if (!courseExists) {
                console.error(`Course with ID ${courseId} not found.`);
                return reply.status(400).send({ message: `Course with ID ${courseId} does not exist.` });
            }

            console.log(`Checking if Student is already enrolled in Course ${courseId}...`);
          
            const existingEnrollment = await Enrollment.findOne({
                where: { UserId: studentId, CourseId: courseId }, 
            });
            if (existingEnrollment) {
                console.error(`Student with ID ${studentId} is already enrolled in Course ${courseId}.`);
                return reply.status(400).send({ message: `Student is already enrolled in course ${courseId}.` });
            }

            console.log(`Enrolling Student ${studentId} in Course ${courseId}...`);
       
            await Enrollment.create({ UserId: studentId, CourseId: courseId }); 
            console.log(`Student ${studentId} successfully enrolled in Course ${courseId}.`);
        }

        return reply.send({ message: "Courses selected successfully." });
    } catch (error) {
        console.error("Error during enrollment process:", error);
        return reply.status(500).send({ message: "Error enrolling in courses."}, error.message);
    }
};

module.exports.getAllCourse = async (req, reply) =>{
    try {
        const courses = await Course.findAll(); 
        reply.send({message : 'Available Courses : ', courses});
    } catch (err) {
        console.error(err);
        reply.status(500).send({ error: "Failed to retrieve courses" });
    }
}

module.exports.getAllRegisteredCourse = async (req, reply) => {
    if (!req.user) {
        console.error("User not authenticated.");
        return reply.status(401).send({ message: "User not authenticated." });
    }

    const studentId = req.user.id;

    try {
        console.log(`Fetching all registered courses for Student ID: ${studentId}`);

        const studentWithCourses = await User.findOne({
            where: { id: studentId },  
            include: [{
                model: Course,
                as: 'enrolledCourses',  
                attributes: ['id', 'name', 'description'],  
                through: { attributes: []},  
            }],
        });

        const courses = studentWithCourses ? studentWithCourses.enrolledCourses : [];

        reply.send({message :'Your Registered Courses:', courses});
    } catch (err) {
        console.error("Error fetching registered courses:", err);
        reply.status(500).send({ error: "Failed to retrieve registered courses" });
    }
};

module.exports.removeRegisteredCourse = async (req, reply) => {

    if (!req.user) {
        console.error("User not authenticated.");
        return reply.status(401).send({ message: "User not authenticated." });
    }
    const { courseId } = req.body;
    const studentId = req.user.id;

    console.log("Enrolling Student ID: ", studentId);
    console.log("Course ID to remove: ", courseId);

    if (!courseId) {
        console.error("Course ID is missing in the request.");
        return reply.status(400).send({ message: "Course ID is require." });
    }

    try {   
            const courseExists = await Course.findByPk(courseId);
            if (!courseExists) {
                console.error(`Course with ID ${courseId} not found.`);
                return reply.status(400).send({ message: `Course with ID ${courseId} does not exist.` });
            }

            console.log(`Checking if Student is already enrolled in Course ${courseId}...`);
          
            const existingEnrollment = await Enrollment.findOne({
                where: { UserId: studentId, CourseId: courseId }, 
            });
            if (!existingEnrollment) {
                console.error(`Student with ID ${studentId} is not enrolled in Course ${courseId}.`);
                return reply.status(400).send({ message: `Student is not enrolled in course ${courseId}.` });
            }

            await existingEnrollment.destroy();
            console.log(`Student ${studentId}is successfully unenrolled from this Course ${courseId}...`);

            return reply.status(200).send({ message: `Student is successfully unenrolled from this course ${courseId}.` });

        } catch (error) {
        console.error("Error during unenrollment process:", error);
        return reply.status(500).send({ message: "Error unenrolling in courses."}, error.message);
    }
};