import Certificate from "../models/Certificate.js";
import { asyncHandler } from "../middleware/trycatchmiddleware.js";
import path from "path";
import { generateCertificatePDF } from "../utils/pdfGenerator.js";
import fs from "fs";

// ✅ Get My Certificates
export const getStudentCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ student: req.user.id })
    .populate("student", "name email profileImage")
    .populate("course", "title thumbnail")
    .populate("instructor", "name profileImage")
    .sort({ createdAt: -1 });
  res.status(200).json(certificates);
});

// ✅ Get Single Certificate Details (Strict Student Owner Check)
export const getStudentCertificateById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id)
    .populate("student", "name email")
    .populate("course", "title thumbnail description")
    .populate("instructor", "name profileImage");

  if (!certificate) {
    res.status(404);
    throw new Error("Certificate not found");
  }

  // Strictly enforce that the logged-in user is the certificate owner (student)
  const studentIdStr = certificate.studentId?.toString() || certificate.student?._id?.toString() || certificate.student?.toString();
  if (studentIdStr !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized. Certificate access belongs only to the student.");
  }

  res.status(200).json(certificate);
});

// ✅ Download Student Certificate PDF (Strict Student Owner Check)
export const downloadStudentCertificatePDF = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id)
    .populate("student", "name email")
    .populate("course", "title")
    .populate("instructor", "name");

  if (!certificate) {
    res.status(404);
    throw new Error("Certificate not found");
  }

  // Strictly enforce that the logged-in user is the certificate owner (student)
  const studentIdStr = certificate.studentId?.toString() || certificate.student?._id?.toString() || certificate.student?.toString();
  if (studentIdStr !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized. Certificate access belongs only to the student.");
  }

  // Strictly check that the certificate is approved or issued
  if (certificate.status !== "approved" && certificate.status !== "issued") {
    res.status(400);
    throw new Error("Certificate is not approved yet. Only approved certificates can be downloaded.");
  }

  let relativePath = certificate.pdfUrl;
  let filePath = relativePath ? path.join(process.cwd(), relativePath.startsWith("/") ? relativePath.substring(1) : relativePath) : null;

  // On-the-fly PDF generation fallback
  if (!relativePath || !fs.existsSync(filePath)) {
    const pdfBuffer = await generateCertificatePDF({
      studentName: certificate.student?.name || certificate.studentName || "Student Name",
      courseTitle: certificate.course?.title || certificate.courseTitle || "Course Title",
      instructorName: certificate.instructor?.name || "Authorized Instructor",
      date: new Date(certificate.approvedAt || certificate.issueDate || Date.now()).toLocaleDateString(),
      certificateId: certificate.certificateId,
    });

    const fileName = `certificate_${certificate._id}.pdf`;
    const uploadDir = path.join(process.cwd(), "uploads", "certificates");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    relativePath = `/uploads/certificates/${fileName}`;
    certificate.pdfUrl = relativePath;
    certificate.url = relativePath;
    await certificate.save();
  }

  res.download(filePath, `Certificate-${certificate.certificateNumber || id}.pdf`);
});
