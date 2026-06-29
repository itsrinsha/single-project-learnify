import VideoProgress from "../models/VideoProgress.js";
import { asyncHandler } from "../middleware/trycatchmiddleware.js";

// ✅ Save Video Progress
export const saveVideoProgress = asyncHandler(async (req, res) => {
  const { courseId, lessonId, watchedSeconds, duration, watchPercentage, lastPlaybackPosition } = req.body;
  const studentId = req.user.id;

  if (!courseId || !lessonId) {
    return res.status(400).json({ message: "Course ID and Lesson ID are required" });
  }

  const completed = watchPercentage >= 80;

  const progress = await VideoProgress.findOneAndUpdate(
    { studentId, lessonId },
    {
      courseId,
      watchedSeconds: Number(watchedSeconds || 0),
      duration: Number(duration || 0),
      watchPercentage: Math.round(Number(watchPercentage || 0)),
      completed,
      lastPlaybackPosition: Number(lastPlaybackPosition || 0),
    },
    { new: true, upsert: true }
  );

  res.status(200).json({
    success: true,
    progress,
  });
});

// ✅ Get Video Progress for a Lesson
export const getVideoProgress = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const studentId = req.user.id;

  const progress = await VideoProgress.findOne({ studentId, lessonId });

  if (!progress) {
    return res.status(200).json({
      success: true,
      progress: {
        watchedSeconds: 0,
        duration: 0,
        watchPercentage: 0,
        completed: false,
        lastPlaybackPosition: 0,
      },
    });
  }

  res.status(200).json({
    success: true,
    progress,
  });
});
