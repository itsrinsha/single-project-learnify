import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Optional — only set when student claims via exam flow
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      default: null,
    },
    certificateId: {
      type: String,
      unique: true,
      required: true,
    },
    certificateCode: {
      type: String,
      unique: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
      default: null,
    },
    // Set to true when student finishes 100% of lessons
    courseCompleted: {
      type: Boolean,
      default: false,
    },
    // Timestamp when instructor approves
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    grade: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
    pdfUrl: {
      type: String,
      default: null,
    },
    certificateNumber: {
      type: String,
      default: null,
    },
    studentName: {
      type: String,
      default: null,
    },
    courseTitle: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "PENDING_APPROVAL", "APPROVED", "REJECTED", "issued", "ISSUED"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Hook to keep legacy and new naming styles fully in sync
certificateSchema.pre("validate", function syncCertificateFields() {
  if (this.student && !this.studentId) this.studentId = this.student;
  if (this.studentId && !this.student) this.student = this.studentId;
  if (this.course && !this.courseId) this.courseId = this.course;
  if (this.courseId && !this.course) this.course = this.courseId;
  if (this.instructor && !this.instructorId) this.instructorId = this.instructor;
  if (this.instructorId && !this.instructor) this.instructor = this.instructorId;

  if (this.certificateId && !this.certificateNumber) this.certificateNumber = this.certificateId;
  if (this.certificateNumber && !this.certificateId) this.certificateId = this.certificateNumber;
  if (this.certificateId && !this.certificateCode) this.certificateCode = this.certificateId;
  if (this.certificateCode && !this.certificateId) this.certificateId = this.certificateCode;
  if (this.certificateNumber && !this.certificateCode) this.certificateCode = this.certificateNumber;
  if (this.certificateCode && !this.certificateNumber) this.certificateNumber = this.certificateCode;

  if (this.url && !this.pdfUrl) this.pdfUrl = this.url;
  if (this.pdfUrl && !this.url) this.url = this.pdfUrl;

  if (this.issueDate && !this.issuedAt) this.issuedAt = this.issueDate;
  if (this.issuedAt && !this.issueDate) this.issueDate = this.issuedAt;

  // Normalize status casing to lowercase
  if (this.status) {
    const lower = this.status.toLowerCase();
    if (lower === "pending_approval" || lower === "pending") {
      this.status = "pending";
    } else if (lower === "approved") {
      this.status = "approved";
    } else if (lower === "rejected") {
      this.status = "rejected";
    } else if (lower === "issued") {
      this.status = "issued";
    }
  }
});

// Prevent duplicate certificate per student+course
certificateSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Certificate", certificateSchema);
