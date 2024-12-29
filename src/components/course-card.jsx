import { Button } from "@nextui-org/button";
import { Link } from "react-router-dom";
import { pathname } from "../routes";
import { FaBookBookmark, FaTrophy } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { Avatar, Image, Progress } from "@nextui-org/react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

export const CourseCard = ({ item }) => {
	return (
		<div className="w-full flex bg-white rounded-lg p-4 shadow-lg border">
			<Image alt={item?.["name"]} src={item?.["image"]} className="w-40 h-40 rounded-lg object-cover" />
			<div className="flex-grow pl-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{item?.["name"]}</h3>
				<div className="flex items-center text-gray-500 text-sm mb-4 gap-2">
					<div className="flex items-center">
						<FaBookBookmark className="mr-2" />
						Words: {item?.["totalWords"]}
					</div>
					<div className="flex items-center">
						<BsFillPeopleFill className="mr-2" />
						Student: {item?.["number enrollments"]}
					</div>
					<div className="flex items-center">
						<FaTrophy className="mr-2" />
						{item?.["course level name"]}
					</div>
				</div>
				<div className="relative mb-4">
					<Progress
						color="warning"
						aria-label="Loading..."
						minValue={0}
						value={item?.["learntWords"]}
						maxValue={item?.["totalWords"]}
						className="max-w-2xl"
					/>
					{item?.["points"] && (
						<div className="flex gap-4 text-sm text-gray-500 mt-1">
							<span>Score: {item?.["points"]}</span>
							<span>Learn: {item?.["learntWords"]}</span>
						</div>
					)}
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<Avatar src={item?.["avatar image"]} className="border-1 border-gray-300" />
						<div>
							<p className="text-sm ml-3 font-semibold text-gray-800">
								{item?.["first name"]} {item?.["last name"]}
							</p>
							<p className="text-xs ml-3 text-gray-500">Author</p>
						</div>
					</div>

					<Button
						as={Link}
						to={pathname.courseParticipant.split(":")[0] + item?.["course id"]}
						className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg
                    shadow-md hover:bg-blue-600"
						endContent={<MdOutlineKeyboardDoubleArrowRight />}>
						Continue
					</Button>
				</div>
			</div>
		</div>
	);
};
