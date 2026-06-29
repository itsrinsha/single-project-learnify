import { 
  checkAttemptEligibilityService, 
  submitAttemptService, 
  createAttemptRequestService, 
  getAttemptHistoryService 
} from "../services/attemptService.js";
import { asyncHandler } from "../middleware/trycatchmiddleware.js";

// ✅ Check Eligibility
export const checkEligibility = asyncHandler(async (req, res) => {
  const eligibility = await checkAttemptEligibilityService(req.user.id, req.params.examId);
  res.json(eligibility);
});

// ✅ Submit Attempt
export const submitAttempt = asyncHandler(async (req, res) => {
  const attempt = await submitAttemptService(req.user.id, req.params.examId, req.body);
  res.status(201).json(attempt);
});

// ✅ Request Extra Attempt
export const requestExtraAttempt = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const request = await createAttemptRequestService(req.user.id, req.params.examId, reason);
  res.status(201).json(request);
});

// ✅ Get History
export const getAttemptHistory = asyncHandler(async (req, res) => {
  const history = await getAttemptHistoryService(req.user.id, req.params.examId);
  res.json(history);
});
