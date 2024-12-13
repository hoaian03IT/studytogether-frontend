import { Feedback } from "./feedback.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseService } from "../apis/course.api.js";
import { Button, CircularProgress } from "@nextui-org/react";
import { queryKeys } from "../react-query/query-keys.js";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { useContext, useRef, useState } from "react";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { CommentService } from "../apis/comment.api.js";
import { FeedbackModal } from "./feedback-modal.jsx";
import { TiEdit } from "react-icons/ti";
import { toast } from "react-toastify";
import { TranslationContext } from "../providers/TranslationProvider.jsx";

function CourseInformationComment({ courseId, authorUsername, enrolled }) {
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);

	const queryClient = useQueryClient();

	const [showFeedback, setShowFeedback] = useState(false);
	const feedbackModalRef = useRef(null);
	const toastId = useRef(null);

	const courseCommentQuery = useQuery({
		queryKey: [queryKeys.courseComment, courseId],
		queryFn: async ({ queryKey }) => {
			try {
				let data = await CourseService.fetchCourseComment(queryKey[1], user, updateUserState);
				data = Object.values(data);
				return data;
			} catch (error) {
				console.error(error);
			}
		},
	});

	const commentFeedbackMutation = useMutation({
		mutationFn: async ({ rate, comment, courseId }) => {
			toastId.current = toast.loading("LOADING");
			return await CommentService.createFeedbackComment({ comment, courseId, rate }, user, updateUserState);
		},
		onSuccess: (data) => {
			let { messageCode, ...rest } = data;
			let comments = queryClient.getQueryData([queryKeys.courseComment, courseId]) || [];
			comments?.unshift(rest);
			console.log(comments);
			queryClient.setQueryData([queryKeys.courseContent, courseId], comments);
			toast.dismiss(toastId.current);
			toast.success(translation(messageCode));
		},
		onError: (error) => {
			console.error(error);
			toast.dismiss(toastId.current);
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	const commentReplyMutation = useMutation({
		mutationFn: async ({ comment, courseId, replyCommentId }) => {
			toastId.current = toast.loading("LOADING");
			return await CommentService.createReplyComment(
				{ comment, courseId, replyCommentId },
				user,
				updateUserState,
			);
		},
		onSuccess: (data) => {
			let { messageCode, ...rest } = data;
			let comments = queryClient.getQueryData([queryKeys.courseComment, courseId]) || [];
			let currentComment = comments.find((comment) => comment["commentId"] === rest["replyCommentId"]);
			currentComment["replies"]?.unshift(rest);
			console.log(currentComment);
			queryClient.setQueryData([queryKeys.courseContent, courseId], comments);
			toast.dismiss(toastId.current);
			toast.success(translation(messageCode));
		},
		onError: (error) => {
			console.error(error);
			toast.dismiss(toastId.current);
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	const handleSubmitFeedback = () => {
		commentFeedbackMutation.mutate({
			rate: feedbackModalRef.current.getRate(),
			comment: feedbackModalRef.current.getFeedback(),
			courseId,
		});
	};

	const handleSubmitReply = (courseId, commentId, comment) => {
		commentReplyMutation.mutate({
			comment: comment,
			courseId,
			replyCommentId: commentId,
		});
	};

	return (
		<div>
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold">
					Comments(
					{courseCommentQuery.data?.reduce((prev, curr) => prev + curr?.["replies"]?.length + 1, 0) || 0})
				</h2>
				{enrolled && (
					<Button
						color="primary"
						radius="sm"
						size="sm"
						startContent={<TiEdit className="size-5" />}
						onClick={() => setShowFeedback(true)}>
						Feedback
					</Button>
				)}
			</div>
			{courseCommentQuery.isLoading ? (
				<div className="flex justify-center">
					<CircularProgress label="LoadingThreeDot..." />
				</div>
			) : (
				<div className="mt-8">
					{courseCommentQuery.data?.map((item) => (
						<Feedback
							courseId={courseId}
							commentId={item["commentId"]}
							name={
								item["firstName"] && item["lastName"]
									? `${item["firstName"]} ${item["lastName"]}`
									: `@${item["username"]}`
							}
							key={item["commentId"]}
							avatar={item["avatarImage"]}
							comment={item["comment"]}
							createdAt={item["createdAt"]}
							role={item["username"] === authorUsername ? "author" : item["role"]}
							rate={item["rate"]}
							onReplySubmit={handleSubmitReply}>
							{!item?.["replies"]
								? null
								: item?.["replies"].map((reply) => (
										<Feedback
											courseId={courseId}
											commentId={item["commentId"]}
											name={
												reply["firstName"] && reply["lastName"]
													? `${reply["firstName"]} ${reply["lastName"]}`
													: `@${reply["username"]}`
											}
											key={reply["commentId"]}
											avatar={reply["avatarImage"]}
											comment={reply["comment"]}
											createdAt={reply["createdAt"]}
											role={reply["username"] === authorUsername ? "author" : reply["role"]}
											onReplySubmit={handleSubmitReply}></Feedback>
								  ))}
						</Feedback>
					))}
				</div>
			)}
			<FeedbackModal
				ref={feedbackModalRef}
				show={showFeedback}
				onClose={() => setShowFeedback(false)}
				onSubmit={handleSubmitFeedback}
			/>
		</div>
	);
}

export { CourseInformationComment };
