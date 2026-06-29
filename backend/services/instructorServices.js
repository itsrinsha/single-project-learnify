import Course from "../models/Course.js";

// get instructor courses
export const getInstructorCoursesService = async (instructorId) => {
  return await Course.find({ instructor: instructorId });
};

// publish course
export const publishCourseService = async ({ courseId, userId }) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.instructor.toString() !== userId) {
    const err = new Error("Not authorized");
    err.statusCode = 403;
    throw err;
  }

  course.status = "published";
  await course.save();

  return true;
};