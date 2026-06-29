import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Review from "../models/Review.js";
import { LiveSession } from "../models/LiveSetion.js";
import Lesson from "../models/Lesson.js";
import Progress from "../models/Progress.js";
import Certificate from "../models/Certificate.js";
import crypto from "crypto";


// get profile

export const getUserProfileService = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// update profile
export const updateUserProfileService = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// enroll
export const enrollCourseService = async ({ userId, courseId }) => {
  // check course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // prevent duplicate enrollment
  const alreadyEnrolled = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  if (alreadyEnrolled) {
    throw new Error("Already enrolled in this course");
  }

  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
    instructor: course.instructor,
  });

  course.enrolledStudentsCount = (course.enrolledStudentsCount || 0) + 1;
  await course.save();

  // Auto-create pending certificate record for this enrollment
  try {
    const existingCert = await Certificate.findOne({ student: userId, course: courseId });
    if (!existingCert) {
      const certId = `LERN-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
      await Certificate.create({
        student: userId,
        course: courseId,
        instructor: course.instructor,
        certificateId: certId,
        status: "pending",
        courseCompleted: false,
      });
    }
  } catch (certErr) {
    // Non-fatal: log but don't fail enrollment
    console.error("[Certificate] Auto-create failed:", certErr.message);
  }

  return enrollment;
};

// get enrolled courses
export const getEnrolledCoursesService = async (userId) => {

  const enrollments = await Enrollment.find({
    user: userId,
  }).populate({
    path: "course",
    populate: {
      path: "instructor",
      select: "name email profileImage verificationDetails",
    },
  });

  const certificates = await Certificate.find({ student: userId });
  const certMap = new Map();
  certificates.forEach(c => {
    if (c.course) {
      certMap.set(c.course.toString(), c._id);
    }
  });

  const activeEnrollments = enrollments.filter(e => e.course && !e.course.isBlocked);

  return activeEnrollments.map((enrollment) => {

    const course = enrollment.course;
    const certId = certMap.get(course._id.toString()) || null;

    return {

      ...enrollment.toObject(),

      progress: enrollment.progress || 0,

      completedLessons: enrollment.completedLessons || 0,

      nextLesson: enrollment.nextLesson || "Start Learning",

      certificateId: certId,

      completionStatus: enrollment.completionStatus || (enrollment.completed ? "completed" : "in-progress"),

      course: {
        ...course.toObject(),

        lessonsCount: course.lessons?.length || 0,
      },
    };
  });
};

// get instructors for a student
export const getInstructorsByStudentService = async (userId) => {
  const enrollments = await Enrollment.find({ user: userId }).populate({
    path: "course",
    populate: {
      path: "instructor",
      select: "name email profileImage",
    },
  });

  // Map to the requested format
  const instructors = enrollments
    .filter(enrollment => enrollment.course && enrollment.course.instructor)
    .map(enrollment => ({
      _id: enrollment.course.instructor._id,
      name: enrollment.course.instructor.name,
      email: enrollment.course.instructor.email,
      profileImage: enrollment.course.instructor.profileImage,
      course: {
        _id: enrollment.course._id,
        title: enrollment.course.title
      }
    }));

  return instructors;
};

// get my enrolled live sessions
export const getMyEnrolledLiveSessionsService = async (userId) => {
  const enrollments = await Enrollment.find({ user: userId });
  const courseIds = enrollments.map(e => e.course);
  
  return await LiveSession.find({ course: { $in: courseIds } })
    .populate("course", "title")
    .populate("instructor", "name profileImage");
};

// get my enrolled reviews
export const getMyEnrolledReviewsService = async (userId) => {
  const enrollments = await Enrollment.find({ user: userId });
  const courseIds = enrollments.map(e => e.course);
  
  return await Review.find({ course: { $in: courseIds } })
    .populate("course", "title")
    .populate("user", "name profileImage");
};



// ✅ Instructor Dashboard
export const getInstructorDashboardService = async (instructorId) => {

  // instructor courses
  const courses = await Course.find({
    instructor: instructorId,
  });

  const courseIds = courses.map(
    (course) => course._id
  );

  // all enrollments for instructor courses
  const enrollments = await Enrollment.find({
    course: { $in: courseIds },
  });

  // earnings
  let totalEarnings = 0;

  enrollments.forEach((enrollment) => {

    const course = courses.find(
      (c) =>
        c._id.toString() ===
        enrollment.course.toString()
    );

    if (course) {
      totalEarnings += course.price || 0;
    }
  });

  return {
    totalCourses: courses.length,

    totalStudents: enrollments.length,

    enrolledStudents: enrollments.length,

    totalEarnings,

    recentCourses: courses.slice(0, 5),
  };
};