import { Image } from "@nextui-org/image";
import { FiMessageCircle } from "react-icons/fi";
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";

function Feedback({ avatar, name, comment, createdAt, role }) {
	const user = useRecoilValue(userState);
	const [isReplying, setIsReplying] = useState(false);
	const [reply, setReply] = useState("");

	const handleReplying = () => {
		setIsReplying(!isReplying);
	};

	return <div>
		<div className="flex items-start">
			<Image draggable={false} loading="lazy" src={avatar} alt={name}
				   className="size-12 object-cover object-center"
				   radius="full" />
			<div className="ms-4">
				<p>
					<span className="font-semibold">{name}</span>
					{role === "admin" ?
						<span className="px-2 py-1 ml-2 bg-purple-500 text-white uppercase text-sm">Admin</span> : null}
					<span className="text-gray-500 text-sm"> • 1 week ago</span>
				</p>
				<p className="text-gray-600 text-sm">{comment}</p>
				<button onClick={handleReplying}
						className="mt-2 text-gray-500 flex items-center text-sm select-none active:opacity-80">
					<FiMessageCircle className="size-5 mr-2" />
					<span className="uppercase">reply</span>
				</button>
			</div>
		</div>
		{isReplying && <div className="flex items-center ms-5 mt-4">
			<Image draggable={false} loading="lazy" src={user.info.avatar} alt={user.info.username}
				   className="size-12 flex-1 object-cover object-center" radius="full" />
			<Input className="px-2" size="sm" color="primary" variant="underlined" type="text" value={reply}
				   onChange={e => setReply(e.target.value)} placeholder="Your comment..."
				   onClear={() => setReply("")} isClearable />
			<Button color="primary" size="sm"
					className="text-primary-foreground uppercase font-bold rounded-sm">Send</Button>
		</div>}
	</div>;
}

export { Feedback };