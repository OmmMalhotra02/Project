import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

const router = Router();

router.route('/:videoId').get(getVideoComments)

router.use(verifyJWT)

router.route('/:videoId').post(addComment)
router.route('/:commentId').patch(updateComment).delete(deleteComment)
export default router