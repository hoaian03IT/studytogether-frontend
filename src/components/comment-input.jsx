import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";

export const CommentInput = ({ userAvatar, username, placeholder, onSubmit, value, setValue }) => {
	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit();
	};
	return (
		<form className="flex items-center ms-5 mt-4" onSubmit={handleSubmit}>
			<Image
				draggable={false}
				loading="lazy"
				src={userAvatar}
				alt={username}
				className="size-8 flex-1 object-cover object-center"
				radius="full"
			/>
			<Input
				className="px-2"
				size="sm"
				color="primary"
				variant="underlined"
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder={placeholder}
				onClear={() => setValue("")}
				isClearable
			/>
			<Button
				color="primary"
				size="sm"
				type="submit"
				className="text-primary-foreground uppercase font-bold rounded-sm">
				Send
			</Button>
		</form>
	);
};
