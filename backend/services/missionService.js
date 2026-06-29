import Mission from "../models/Mission.js";
import MissionSubmission from "../models/MissionSubmission.js";
import { checkAndCreatePendingCertificate } from "./certificateService.js";

// Create a new mission
export const createMissionService = async (instructorId, missionData) => {
  const mission = new Mission({
    ...missionData,
    instructor: instructorId,
  });
  return await mission.save();
};

// Get missions for a course, optionally including the user's submission details
export const getCourseMissionsService = async (courseId, userId = null) => {
  const missions = await Mission.find({ course: courseId })
    .populate("module", "name")
    .populate("lesson", "title")
    .sort({ deadline: 1 });

  if (!userId) {
    return missions;
  }

  // Fetch student submissions for these missions
  const missionIds = missions.map((m) => m._id);
  const submissions = await MissionSubmission.find({
    mission: { $in: missionIds },
    student: userId,
  });

  // Map submissions to missions
  const missionsWithSubmissions = missions.map((mission) => {
    const submission = submissions.find(
      (sub) => sub.mission.toString() === mission._id.toString()
    );
    return {
      ...mission.toObject(),
      submission: submission || null,
    };
  });

  return missionsWithSubmissions;
};

// Student submits a mission
export const submitMissionService = async (studentId, missionId, { submissionUrl, studentNotes }) => {
  // Check if mission exists
  const mission = await Mission.findById(missionId);
  if (!mission) {
    throw new Error("Mission not found");
  }

  // Check if student already submitted this mission
  let submission = await MissionSubmission.findOne({
    mission: missionId,
    student: studentId,
  });

  if (submission) {
    // If it exists, update it and reset status to pending
    submission.submissionUrl = submissionUrl;
    submission.studentNotes = studentNotes;
    submission.status = "pending";
    submission.submittedAt = Date.now();
  } else {
    // Create new submission
    submission = new MissionSubmission({
      mission: missionId,
      student: studentId,
      submissionUrl,
      studentNotes,
      status: "pending",
    });
  }

  return await submission.save();
};

// Instructor gets submissions for a mission
export const getMissionSubmissionsService = async (missionId) => {
  return await MissionSubmission.find({ mission: missionId })
    .populate("student", "name email")
    .sort({ submittedAt: -1 });
};

// Instructor evaluates a submission
export const evaluateSubmissionService = async (submissionId, { status, feedback, obtainedMarks }) => {
  const submission = await MissionSubmission.findById(submissionId).populate("mission");
  if (!submission) {
    throw new Error("Submission not found");
  }

  submission.status = status; // 'completed' or 'rejected'
  submission.feedback = feedback;
  if (obtainedMarks !== undefined) {
    submission.obtainedMarks = obtainedMarks;
  }
  
  const savedSubmission = await submission.save();

  if (status === "completed" && submission.mission) {
    try {
      await checkAndCreatePendingCertificate(submission.student, submission.mission.course);
    } catch (certErr) {
      console.error("[Certificate] Check after mission evaluation failed:", certErr.message);
    }
  }

  return savedSubmission;
};
