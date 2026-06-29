import Certificate from "../models/Certificate.js";
import Enrollment from "../models/Enrollment.js";
import ExamAttempt from "../models/ExamAttempt.js";
import Exam from "../models/Exam.js";
import Progress from "../models/Progress.js";
import Mission from "../models/Mission.js";
import MissionSubmission from "../models/MissionSubmission.js";
import Course from "../models/Course.js";
import crypto from "crypto";
import { generateCertificatePDF } from "../utils/pdfGenerator.js";
import fs from "fs";
import path from "path";

// ✅ Generate Unique Certificate ID
const generateUniqueId = (userId, courseId) => {
  const data = `${userId}-${courseId}-${Date.now()}`;
  return `LERN-${crypto.createHash("md5").update(data).digest("hex").toUpperCase().substring(0, 10)}`;
};

// ✅ Automatically check eligibility and generate a PENDING certificate
export const checkAndCreatePendingCertificate = async (userId, courseId) => {
  try {
    // 1. Check if certificate already exists
    const existingCert = await Certificate.findOne({ student: userId, course: courseId });
    if (existingCert) {
      console.log(`[Certificate] Already exists for student ${userId} on course ${courseId}`);
      return existingCert;
    }

    // 2. Check 100% course progress
    const progress = await Progress.findOne({ student: userId, course: courseId });
    if (!progress || progress.progressPercentage < 100) {
      console.log(`[Certificate] Progress is not 100% yet (${progress?.progressPercentage || 0}%)`);
      return null;
    }

    // 3. Check exams passed
    const exams = await Exam.find({ course: courseId, isDraft: { $ne: true } });
    for (const exam of exams) {
      const criteria = {
        student: userId,
        exam: exam._id,
        result: "pass"
      };
      if (exam.examType === "machine_task" || exam.taskType === "task") {
        criteria.status = "approved";
      }
      const passedAttempt = await ExamAttempt.findOne(criteria);
      if (!passedAttempt) {
        console.log(`[Certificate] Required exam ${exam._id} not passed yet (needs pass result and approved status for machine tasks)`);
        return null;
      }
    }

    // 4. Check missions completed
    const missions = await Mission.find({ course: courseId });
    for (const mission of missions) {
      const completedSubmission = await MissionSubmission.findOne({
        student: userId,
        mission: mission._id,
        status: "completed"
      });
      if (!completedSubmission) {
        console.log(`[Certificate] Required mission ${mission._id} not completed yet`);
        return null;
      }
    }

    // 5. If eligible, create a pending certificate
    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");

    const certificateId = generateUniqueId(userId, courseId);
    const newCert = await Certificate.create({
      student: userId,
      course: courseId,
      instructor: course.instructor,
      certificateId,
      status: "pending",
      courseCompleted: true,
      completionDate: new Date(),
      issueDate: new Date(),
    });

    console.log(`[Certificate] Automatically created pending certificate ${certificateId} for user ${userId}`);
    return newCert;
  } catch (error) {
    console.error("[Certificate] Error in checkAndCreatePendingCertificate:", error.message);
    return null;
  }
};

// ✅ Claim Certificate via Exam (legacy flow — kept for backward compat)
export const checkEligibilityAndGenerateService = async (userId, examId) => {
  const exam = await Exam.findById(examId).populate("course");
  if (!exam) throw new Error("Exam not found");

  const courseId = exam.course._id;

  // Must be enrolled and course completed
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (!enrollment || !enrollment.completed) {
    throw new Error("You must complete 100% of the course before receiving a certificate");
  }

  // Must have passed the exam
  const latestAttempt = await ExamAttempt.findOne({ student: userId, exam: examId }).sort({ createdAt: -1 });
  if (!latestAttempt || latestAttempt.result !== "pass") {
    throw new Error("You must pass the exam to receive a certificate");
  }

  if ((exam.examType === "machine_task" || exam.taskType === "task") && latestAttempt.status !== "approved") {
    throw new Error("Your task submission must be approved to receive a certificate");
  }

  // Update existing auto-created cert (or create if somehow missing)
  const existingCert = await Certificate.findOne({ student: userId, course: courseId });
  if (existingCert) {
    // Update with exam info and mark completed
    existingCert.exam = examId;
    existingCert.courseCompleted = true;
    existingCert.grade =
      latestAttempt.score >= 90 ? "A+" :
      latestAttempt.score >= 80 ? "A"  :
      latestAttempt.score >= 70 ? "B"  : "C";
    await existingCert.save();
    return existingCert;
  }

  // Fallback: create fresh
  const certificateId = generateUniqueId(userId, courseId);
  const certificate = await Certificate.create({
    student: userId,
    course: courseId,
    instructor: exam.instructor,
    exam: examId,
    certificateId,
    grade:
      latestAttempt.score >= 90 ? "A+" :
      latestAttempt.score >= 80 ? "A"  :
      latestAttempt.score >= 70 ? "B"  : "C",
    status: "pending",
    courseCompleted: true,
  });

  return certificate;
};

// ✅ Get Student Certificates (all statuses)
export const getStudentCertificatesService = async (userId) => {
  return await Certificate.find({ student: userId })
    .populate("student", "name email profileImage")
    .populate("course", "title thumbnail")
    .populate("instructor", "name profileImage")
    .sort({ createdAt: -1 });
};

// ✅ Approve Certificate (set status + approvedAt)
export const approveCertificateService = async (certificateId) => {
  const certificate = await Certificate.findById(certificateId)
    .populate("student", "name email")
    .populate("course", "title")
    .populate("instructor", "name");

  if (!certificate) throw new Error("Certificate request not found");

  certificate.status = "approved";
  certificate.approvedAt = new Date();
  certificate.issuedAt = new Date();
  certificate.issueDate = new Date();

  // Sync names on model fields
  certificate.studentName = certificate.student?.name || "Student Name";
  certificate.courseTitle = certificate.course?.title || "Course Title";

  // Generate PDF buffer
  const pdfBuffer = await generateCertificatePDF({
    studentName: certificate.student?.name || "Student Name",
    courseTitle: certificate.course?.title || "Course Title",
    instructorName: certificate.instructor?.name || "Authorized Instructor",
    date: new Date().toLocaleDateString(),
    certificateId: certificate.certificateId,
  });

  // Save PDF inside /uploads/certificates
  const fileName = `certificate_${certificate._id}.pdf`;
  const uploadDir = path.join(process.cwd(), "uploads", "certificates");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, pdfBuffer);

  // Store url in database
  const fileUrl = `/uploads/certificates/${fileName}`;
  certificate.pdfUrl = fileUrl;
  certificate.url = fileUrl;

  return await certificate.save();
};

// ✅ Reject Certificate service
export const rejectCertificateService = async (certificateId, rejectionReason) => {
  const certificate = await Certificate.findById(certificateId);
  if (!certificate) throw new Error("Certificate not found");
  certificate.status = "rejected";
  certificate.rejectedAt = new Date();
  certificate.rejectionReason = rejectionReason || "No reason provided";
  return await certificate.save();
};

// ✅ Get Single Certificate by ID (Authorized only)
export const getCertificateByIdService = async (id, userId) => {
  const certificate = await Certificate.findById(id)
    .populate("student", "name email")
    .populate("course", "title thumbnail description")
    .populate("instructor", "name profileImage");
  
  if (!certificate) throw new Error("Certificate not found");
  // Check authorization: must be student who owns it, or the instructor of the course
  if (
    certificate.student._id.toString() !== userId && 
    certificate.instructor._id.toString() !== userId
  ) {
    throw new Error("Not authorized to view this certificate");
  }
  return certificate;
};

// ✅ Verify Certificate via Code
export const verifyCertificateService = async (certificateCode) => {
  const certificate = await Certificate.findOne({ certificateCode })
    .populate("student", "name")
    .populate("course", "title description")
    .populate("instructor", "name");
  
  if (!certificate) {
    throw new Error("Certificate not found or invalid code");
  }

  return {
    valid: certificate.status === "approved",
    certificateCode: certificate.certificateCode,
    studentName: certificate.student.name,
    courseTitle: certificate.course.title,
    completionDate: certificate.approvedAt || certificate.issueDate,
    instructorName: certificate.instructor.name,
    status: certificate.status,
  };
};

// ✅ Get Pending Requests for Instructor (courseCompleted=true, status=pending)
export const getPendingCertificatesForInstructorService = async (instructorId) => {
  const certs = await Certificate.find({
    instructor: instructorId,
    status: "pending",
    courseCompleted: true,
  })
    .populate("student", "name email profileImage")
    .populate("course", "title thumbnail")
    .sort({ createdAt: -1 });

  const enriched = await Promise.all(certs.map(async (cert) => {
    if (!cert.student) return cert.toObject();
    const progress = await Progress.findOne({ student: cert.student._id, course: cert.course._id });
    return {
      ...cert.toObject(),
      progressPercentage: progress ? progress.progressPercentage : 100,
      completedLessonsCount: progress ? progress.completedLessons.length : 0,
    };
  }));

  return enriched;
};

// ✅ Get ALL certificates for instructor (all statuses — for history/tabs)
export const getInstructorAllCertificatesService = async (instructorId) => {
  const certs = await Certificate.find({ instructor: instructorId })
    .populate("student", "name email profileImage")
    .populate("course", "title thumbnail")
    .sort({ createdAt: -1 });

  const enriched = await Promise.all(certs.map(async (cert) => {
    if (!cert.student) return cert.toObject();
    const progress = await Progress.findOne({ student: cert.student._id, course: cert.course._id });
    return {
      ...cert.toObject(),
      progressPercentage: progress ? progress.progressPercentage : 100,
      completedLessonsCount: progress ? progress.completedLessons.length : 0,
    };
  }));

  return enriched;
};
