import { 
  checkEligibilityAndGenerateService, 
  getStudentCertificatesService, 
  approveCertificateService,
  rejectCertificateService,
  getPendingCertificatesForInstructorService,
  getInstructorAllCertificatesService,
  getCertificateByIdService,
  verifyCertificateService,
} from "../services/certificateService.js";
import { asyncHandler } from "../middleware/trycatchmiddleware.js";
import { generateCertificatePDF } from "../utils/pdfGenerator.js";
import Certificate from "../models/Certificate.js";

// ✅ Claim Certificate (exam-based, optional legacy flow)
export const claimCertificate = asyncHandler(async (req, res) => {
  const { examId } = req.body;
  const certificate = await checkEligibilityAndGenerateService(req.user.id, examId);
  res.status(201).json(certificate);
});

// ✅ Get My Certificates (student)
export const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await getStudentCertificatesService(req.user.id);
  res.status(200).json(certificates);
});

// ✅ Get Single Certificate by ID (Student/Instructor)
export const getCertificateById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await getCertificateByIdService(id, req.user.id);
  res.status(200).json(certificate);
});

// ✅ Verify Certificate Code (Public)
export const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateCode } = req.params;
  const verification = await verifyCertificateService(certificateCode);
  res.status(200).json(verification);
});

// ✅ Download Certificate PDF (approved only)
export const downloadCertificatePDF = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id)
    .populate("student", "name")
    .populate("course", "title")
    .populate("instructor", "name");

  if (!certificate) throw new Error("Certificate not found");
  if (certificate.student._id.toString() !== req.user.id) throw new Error("Not authorized");
  if (certificate.status !== "approved") throw new Error("Certificate has not been approved by the instructor yet.");

  const certData = {
    studentName: certificate.student.name,
    courseTitle: certificate.course.title,
    instructorName: certificate.instructor.name,
    date: new Date(certificate.approvedAt || certificate.issueDate).toLocaleDateString(),
    certificateId: certificate.certificateId,
  };

  const pdfBuffer = await generateCertificatePDF(certData);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=Certificate-${certificate.certificateId}.pdf`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
});

// ✅ Approve Certificate (Instructor only)
export const approveCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedCert = await approveCertificateService(id);
  res.status(200).json(updatedCert);
});

// ✅ Reject Certificate (Instructor only)
export const rejectCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;
  const updatedCert = await rejectCertificateService(id, rejectionReason);
  res.status(200).json(updatedCert);
});

// ✅ Get Pending Certificate Requests (Instructor only — courseCompleted=true)
export const getPendingCertificates = asyncHandler(async (req, res) => {
  const pendingRequests = await getPendingCertificatesForInstructorService(req.user.id);
  res.status(200).json(pendingRequests);
});

// ✅ Get All Certificate Records for Instructor (all statuses)
export const getInstructorAllCertificates = asyncHandler(async (req, res) => {
  const all = await getInstructorAllCertificatesService(req.user.id);
  res.status(200).json(all);
});
