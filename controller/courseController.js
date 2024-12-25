const { User } = require('../models');
const { Course } = require('../models');
const { Enrollment } = require('../models/enrollCourse');

const getAllCourses = async (request, reply) => {
  try {
    const courses = await Course.findAll();
    return reply.send(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return reply.status(500).send({ message: 'Error fetching courses' });
  }
};

const createCourse = async (request, reply) => {
  const { name, description } = request.body;
  const teacherId = request.user.id;

  if (!name || !description) {
    return reply.status(400).send({ message: 'Course name and description are required' });
  }

  try {
    const existingCourse = await Course.findOne({ where: { name } });
    if (existingCourse) {
      return reply.status(400).send({ message: 'Course already exists' });
    }

    const newCourse = await Course.create({ name, description, teacherId });
    return reply.status(201).send({
      message: 'Course created successfully',
      course: newCourse,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return reply.status(500).send({ message: 'Error creating course', error: error.message });
  }
};

const updateCourse = async (request, reply) => {
  const { id } = request.params;
  const { name, description } = request.body;
  const teacherId = request.user.id;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return reply.status(404).send({ message: 'Course not found' });
    }
    if (course.teacherId !== teacherId) {
      return reply.status(403).send({ message: 'You are not authorized to update this course' });
    }

    if (name) course.name = name;
    if (description) course.description = description;

    await course.save();
    return reply.send({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Error updating course:', error);
    return reply.status(500).send({ message: 'Error updating course' });
  }
};

const deleteCourse = async (request, reply) => {
  const { id } = request.params;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return reply.status(404).send({ message: 'Course not found' });
    }

    await course.destroy();
    return reply.send({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return reply.status(500).send({ message: 'Error deleting course' });
  }
};

const getStudentsForTeacherCourses = async (req, reply) => {
  const teacherId = req.user.id;

  try {

    const students = await Enrollment.findAll({
      include: [
        {
          model: Course,
          attributes: ['id', 'name'],
          where: { teacherId }, 
        },
        {
          model: User,
          attributes: ['id', 'name'],
          where: { role: 'student' }, 
        },
      ],
    });

  const resultMap = new Map();
   students.forEach((apple) => {
      const { Course, User } = apple;
      const courseId = Course.id;

      if (!resultMap.has(courseId)) {
        resultMap.set(courseId, {
          courseId,
          courseName: Course.name,
          studentCount: 0, 
          students: [],
        });
      }

     
      const courseData = resultMap.get(courseId);
      courseData.students.push({
        studentName: User.name,
      });
      courseData.studentCount += 1; 
    });

   
    const result = Array.from(resultMap.values());

    return reply.status(200).send({
      message: 'Students grouped by courses with counts retrieved successfully.',
      data: result,
    
    });
  } catch (error) {
    console.error('Error fetching students for teacher\'s courses:', error);
    return reply.status(500).send({
      error: 'Failed to retrieve data',
      details: error.message,
    });
  }
};



module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getStudentsForTeacherCourses
 ,
};
