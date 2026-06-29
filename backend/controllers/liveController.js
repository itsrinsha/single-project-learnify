import { asyncHandler } from "../middleware/trycatchmiddleware.js";
import { 
  createLiveSessionService, 
  endLiveSessionService, 
  getLiveSessionsService, 
  startLiveSessionService, 
  getMyLiveSessionsService,
  deleteLiveSessionService
} from "../services/liveServices.js";


// ✅ Create
export const createLiveSession = asyncHandler(async (req, res, next) => {
  const session = await createLiveSessionService({
    ...req.body,
    instructor: req.user.id,
  });

  res.status(201).json(session);
});

// ✅ Get
export const getLiveSessions = asyncHandler(async (req, res, next) => {
  const sessions = await getLiveSessionsService(req.params.courseId);
  res.json(sessions);
});

// ✅ Get My Live Sessions
export const getMyLiveSessions = asyncHandler(async (req, res, next) => {
  const sessions = await getMyLiveSessionsService(req.user.id);
  res.json(sessions);
});

// ✅ Start
export const startLiveSession = asyncHandler(async (req, res, next) => {
  await startLiveSessionService({
    sessionId: req.params.id,
    userId: req.user.id,
  });

  res.json({ message: "Live session started" });
});

// ✅ End
export const endLiveSession = asyncHandler(async (req, res, next) => {
  await endLiveSessionService({
    sessionId: req.params.id,
    userId: req.user.id,
  });

  res.json({ message: "Live session ended" });
});

// ✅ Delete
export const deleteLiveSession = asyncHandler(async (req, res, next) => {
  await deleteLiveSessionService(req.user.id, req.params.id);
  res.json({ message: "Live session deleted successfully" });
});