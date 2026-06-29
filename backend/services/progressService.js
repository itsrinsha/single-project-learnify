import Progress from "../models/Progress.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Enrollment from "../models/Enrollment.js";
import Certificate from "../models/Certificate.js";
import VideoProgress from "../models/VideoProgress.js";
import { checkAndCreatePendingCertificate } from "./certificateService.js";

// ✅ Mark Lesson as Completed / complete-lesson
export const markLessonCompletedService = async (userId, courseId, lessonId) => {
  // 1. Verify Enrollment
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (!enrollment) throw new Error("You are not enrolled in this course");

  // 1b. Verify Lesson exists & validate watch progress if it's a video lesson
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new Error("Lesson not found");

  if (lesson.videoUrl) {
    const videoProgress = await VideoProgress.findOne({ studentId: userId, lessonId });
    const watchPct = videoProgress ? videoProgress.watchPercentage : 0;
    if (watchPct < 80) {
      throw new Error("You must watch at least 80% of the video to mark this lesson as completed");
    }
  }

  // 2. Find or Create Progress record
  let progress = await Progress.findOne({ student: userId, course: courseId });
  if (!progress) {
    progress = await Progress.create({ student: userId, course: courseId, completedLessons: [] });
  }

  // 3. Add lesson if not already present
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }

  // 4. Update lastWatchedLesson
  progress.lastWatchedLesson = lessonId;
  progress.lastAccessed = Date.now();

  // 5. Calculate Percentage
  const lessons = await Lesson.find({ courseId });
  const totalLessons = lessons.length;
  const completedCount = progress.completedLessons.length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  progress.progressPercentage = percentage;

  // 6. Update Enrollment completion status if 100%
  if (percentage === 100) {
    progress.completedAt = Date.now();
    enrollment.completed = true;
    await enrollment.save();

    // Mark certificate as course-completed so instructor can approve
    try {
      await Certificate.findOneAndUpdate(
        { student: userId, course: courseId },
        { courseCompleted: true }
      );
      // Automatically check and create certificate
      await checkAndCreatePendingCertificate(userId, courseId);
    } catch (certErr) {
      console.error("[Certificate] courseCompleted update failed:", certErr.message);
    }
  }

  await progress.save();

  return { 
    percentage, 
    completedLessons: progress.completedLessons, 
    lastWatchedLesson: progress.lastWatchedLesson,
    totalLessons 
  };
};

// ✅ Get Course Progress
export const getCourseProgressService = async (userId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const progress = await Progress.findOne({ student: userId, course: courseId });
  const lessons = await Lesson.find({ courseId });
  const totalLessons = lessons.length;

  const completedLessons = progress ? progress.completedLessons : [];
  const completedCount = completedLessons.length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Keep progressPercentage in DB in sync
  if (progress && progress.progressPercentage !== percentage) {
    progress.progressPercentage = percentage;
    await progress.save();
  }

  return {
    percentage,
    completedLessons,
    lastWatchedLesson: progress ? progress.lastWatchedLesson : null,
    totalLessons
  };
};

// ✅ Get Progress by Student (For Instructor/Admin review)
export const getProgressByStudentService = async (courseId, studentId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const progress = await Progress.findOne({ student: studentId, course: courseId });
  const lessons = await Lesson.find({ courseId });
  const totalLessons = lessons.length;

  const completedLessons = progress ? progress.completedLessons : [];
  const completedCount = completedLessons.length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    percentage,
    completedLessons,
    lastWatchedLesson: progress ? progress.lastWatchedLesson : null,
    totalLessons
  };
};

