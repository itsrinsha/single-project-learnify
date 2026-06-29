import { markLessonCompletedService, getCourseProgressService, getProgressByStudentService } from "../services/progressService.js";
import { asyncHandler } from "../middleware/trycatchmiddleware.js";

// ✅ Mark Completed
export const markLessonCompleted = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.body;
  const result = await markLessonCompletedService(req.user.id, courseId, lessonId);
  res.status(200).json(result);
});

// ✅ Get Progress
export const getCourseProgress = asyncHandler(async (req, res) => {
  const result = await getCourseProgressService(req.user.id, req.params.courseId);
  res.status(200).json(result);
});

// ✅ Get Progress by Student for Instructor/Admin
export const getProgressByStudent = asyncHandler(async (req, res) => {
  const { courseId, studentId } = req.params;
  const result = await getProgressByStudentService(courseId, studentId);
  res.status(200).json(result);
});
