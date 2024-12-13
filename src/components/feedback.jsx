import { Image } from "@nextui-org/image";
import { FiMessageCircle } from "react-icons/fi";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import RatingStar from "react-rating-star-with-type";
import TimeAgo from "react-timeago";
import { CommentInput } from "./comment-input.jsx";

function Feedback({ courseId, commentId, avatar, name, comment, createdAt, role, children, rate, onReplySubmit }) {
	const user = useRecoilValue(userState);
	const [isReplying, setIsReplying] = useState(false);
	const [reply, setReply] = useState("");

	const handleReplying = () => {
		setIsReplying(!isReplying);
	};

	const handleReplySubmit = () => {
		onReplySubmit(courseId, commentId, reply);
		setIsReplying(false);
	};

	return (
		<div className="mb-8">
			<div className="flex items-start">
				<Image
					draggable={false}
					loading="lazy"
					src={avatar}
					alt={name}
					className="size-10 object-cover object-center"
					radius="full"
				/>
				<div className="ms-4">
					<p>
						<span className="font-semibold">{name}</span>
						{role.toLocaleLowerCase() === "admin" || role.toLocaleLowerCase() === "author" ? (
							<span className="px-2 ml-2 bg-purple-500 text-white uppercase text-sm">
								{role[0].toUpperCase().concat(role.slice(1))}
							</span>
						) : null}
						<span className="text-gray-500 text-sm">
							{" "}
							• <TimeAgo date={new Date(createdAt)} />
						</span>
					</p>
					{rate && <RatingStar value={rate} count={5} activeColor="#FFD700" />}
					<p className="text-gray-600 text-sm">{comment}</p>
					<button
						onClick={handleReplying}
						className="mt-2 text-gray-500 flex items-center text-sm select-none active:opacity-80">
						<FiMessageCircle className="size-5 mr-2" />
						<span className="uppercase">reply</span>
					</button>
				</div>
			</div>
			{isReplying && (
				<CommentInput
					userAvatar={user.info.avatar}
					username={user.info.username}
					placeholder="Your comment..."
					onSubmit={handleReplySubmit}
					value={reply}
					setValue={setReply}
				/>
			)}
			<div className="ms-10 mt-4">{children}</div>
		</div>
	);
}

export { Feedback };
