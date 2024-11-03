import { Feedback } from "./feedback.jsx";
import { useQuery } from "@tanstack/react-query";
import { CourseService } from "../apis/course.api.js";
import { CircularProgress } from "@nextui-org/react";
import { queryKeys } from "../react-query/query-keys.js";

function CourseInformationComment({ courseId, authorUsername }) {
	const courseCommentQuery = useQuery({
		queryKey: [queryKeys.courseComment, courseId],
		queryFn: async ({ queryKey }) => {
			try {
				let data = await CourseService.fetchCourseComment(queryKey[1]);
				data = Object.values(data);
				return data;
			} catch (error) {
				console.error(error);
			}
		},
	});
	return <div>
		<h2 className="text-xl font-bold">Comments(1)</h2>
		{courseCommentQuery.isLoading ?
			<div className="flex justify-center"><CircularProgress label="Loading..." /></div> :
			<div className="mt-8">
				{courseCommentQuery.data?.map(item =>
					<Feedback
						name={item["firstName"] && item["lastName"] ? `${item["firstName"]} ${item["lastName"]}` : `@${item["username"]}`}
						key={item["commentId"]}
						avatar={item["avatarImage"]}
						comment={item["comment"]}
						createdAt={item["createdAt"]}
						role={item["username"] === authorUsername ? "author" : item["role"]}
						rate={item["rate"]}
					>
						{!item?.replies ? null : item?.replies.map(reply => <Feedback
							name={reply["firstName"] && reply["lastName"] ? `${reply["firstName"]} ${reply["lastName"]}` : `@${reply["username"]}`}
							key={reply["commentId"]}
							avatar={reply["avatarImage"]}
							comment={reply["comment"]}
							createdAt={reply["createdAt"]}
							role={reply["role"]}></Feedback>)}
					</Feedback>,
				)}

			</div>}

	</div>;
}

export { CourseInformationComment };