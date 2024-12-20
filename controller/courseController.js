const { Course, Teacher } = require('../models');

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
  const { name, teacherId } = request.body;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return reply.status(404).send({ message: 'Course not found' });
    }

    if (name) course.name = name;
    if (teacherId) {
      const teacher = await Teacher.findByPk(teacherId);
      if (!teacher) {
        return reply.status(404).send({ message: 'Teacher not found' });
      }
      course.teacherId = teacherId;
    }

    await course.save();
    return reply.send({
      message: 'Course updated successfully',
      course,
    });
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

const acceptCourse = async (request, reply) => {
  try {
    const { courseId } = request.params;
    const studentId = request.user.id;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return reply.status(404).send({ message: 'Course not found' });
    }

    const student = await Student.findByPk(studentId);
    if (!student) {
      return reply.status(404).send({ message: 'Student not found' });
    }

    await course.addStudent(student);
    return reply.send({
      message: `Student ${studentId} successfully enrolled in course ${courseId}`,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: 'Error enrolling in course' });
  }
};

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  acceptCourse,
};
