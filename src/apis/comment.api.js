import { createHttpAuth } from "../config/http";

class CommentService {
	static async createFeedbackComment({ comment, rate, courseId }, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post(`/comment/feedback`, { comment, rate, courseId });
		return res.data;
	}
	static async createReplyComment({ comment, replyCommentId, courseId }, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post(`/comment/reply`, { comment, replyCommentId, courseId });
		return res.data;
	}
}

export { CommentService };
