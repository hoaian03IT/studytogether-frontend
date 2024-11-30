import React, { useState } from "react";
import {
	Avatar,
	Button,
	Modal,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Progress,
} from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import { FaBookBookmark, FaTrophy } from "react-icons/fa6";
import { BsFillPeopleFill, BsThreeDots } from "react-icons/bs";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";


const startCourse = [
	{
		image: "https://nextui.org/images/hero-card-complete.jpeg",
		label: "Learning historical words and sentences",
		word: 30,
		students: 400,
		level: "Advanced",
		author: {
			name: "Jon Kantner",
			avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
			role: "Author",
		},
	},

	{
		image: "https://nextui.org/images/hero-card-complete.jpeg",
		label: "Learning historical words and sentences",
		word: 30,
		students: 400,
		level: "Advanced",
		author: {
			name: "Jon Kantner",
			avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
			role: "Author",
		},
	},

	{
		image: "https://nextui.org/images/hero-card-complete.jpeg",
		label: "Learning historical words and sentences",
		word: 30,
		students: 400,
		level: "Advanced",
		author: {
			name: "Jon Kantner",
			avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
			role: "Author",
		},
	},

];

const continueCourse = [
	{
		image: "https://nextui.org/images/hero-card-complete.jpeg",
		label: "Learning historical words and sentences",
		words: 76,
		students: 198,
		level: "Advanced",
		score: "40 / 100",
		learned: "26 / 76",
		progress: 60,
		author: {
			name: "Jon Kantner",
			avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
			role: "Author",
		},
	},
];

const EditDelete = [
	{ label: "Edit", key: "edit" },
	{ label: "Delete", key: "delete" },

];

const MyCourse = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleDelete = () => {
		setIsModalVisible(true); // Trigger modal
	};

	const confirmDelete = () => {
		console.log("Item deleted");
		setIsModalVisible(false); // Close modal
	};

	const cancelDelete = () => {
		setIsModalVisible(false); // Close modal
	};

	return (
		<div className="container max-w-screen-xl py-10 px-4 bg-slate-200">

			<div className="py-4 grid xl:grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1 mb-10">
				{startCourse.map((item, index) => (
					<div key={index} className="bg-white rounded-lg p-4">
						<Image
							alt="NextUI hero Image"
							src={item.image}
							className="w-full rounded-md"
						/>
						<h3 className="line-clamp-1 py-2 text-lg font-semibold text-gray-800 ">{item.label}</h3>
						<div className="flex flex-wrap justify-between text-slate-400 py-3">
							<div className="flex gap-2 items-center text-gray-500">
								<FaBookBookmark />
								<p>Lesson: {item.lessons}</p>
							</div>
							<div className="flex gap-2 items-center  text-gray-500">
								<BsFillPeopleFill />
								<p>Student : {item.students}</p>
							</div>
							<div className="flex gap-2 items-center  text-gray-500">
								<FaTrophy />
								<p>{item.level}</p>
							</div>
						</div>
						<div className="flex mt-4">
							<div className="flex justify-start mr-auto">
								<Avatar src={item.author.avatar} />
								<div>
									<p className="text-sm ml-3 font-semibold text-gray-800">{item.author.name}</p>
									<p className="text-xs ml-3 text-gray-500">{item.author.role}</p>
								</div>
							</div>
							<div>
								<Popover>
									<PopoverTrigger>
										<Button isIconOnly
												className="rounded-full bg-white border-2 border-gray-500 mr-4"
												aria-label="Options">
											<BsThreeDots className="text-medium" />
										</Button>
									</PopoverTrigger>

									<PopoverContent placement="bottom">
										<div className="flex flex-col py-2">
											<button
												onClick={() => console.log("Edit action triggered")}
												className="px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
											>
												Edit
											</button>
											<button
												onClick={handleDelete}
												className="px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
											>
												Delete
											</button>
										</div>
									</PopoverContent>
								</Popover>
							</div>
							<div>
								<Button
									className="px-4 py-2 flex justify-end ml-auto bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600"
									endContent={<MdOutlineKeyboardDoubleArrowRight />}
								>
									Start
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
			<div>
				<span className=" text-2xl font-bold">Unfinished Courses</span></div>

			<div className=" max-w-xl mt-10    ">
				{continueCourse.map((item, index) => (
					<div key={index} className="bg-white rounded-lg p-4 shadow-lg border ">
						<div className="flex">
							{/* Left Section: Image */}
							<div className="flex-shrink-0">
								<Image
									alt={item.label}
									src={item.image}
									className="w-40 h-40 rounded-lg object-cover "
								/>
							</div>

							{/* Right Section: Content */}
							<div className="flex-grow pl-6">
								<h3 className="text-lg font-semibold text-gray-800 mb-2">{item.label}</h3>
								<div className="flex items-center text-gray-500 text-sm mb-4">
									<div className="flex items-center mr-4">
										<FaBookBookmark className="mr-2" />
										Words: {item.words}
									</div>
									<div className="flex items-center mr-4">
										<BsFillPeopleFill className="mr-2" />
										Student: {item.students}
									</div>
									<div className="flex items-center">
										<FaTrophy className="mr-2" />
										{item.level}
									</div>
								</div>

								{/* Progress Bar */}
								<div className="relative mb-4">
									<Progress
										color="warning"
										aria-label="LoadingThreeDot..."
										value={item.progress}
										className="max-w-2xl"
									/>
									<div className="flex justify-between text-sm text-gray-500 mt-1">
										<span>Score: {item.score}</span>
										<span>Learn: {item.learned}</span>
									</div>
								</div>

								{/* Author Info & Button */}
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<Avatar src={item.author.avatar} />
										<div>
											<p className="text-sm ml-3 font-semibold text-gray-800">{item.author.name}</p>
											<p className="text-xs ml-3 text-gray-500">{item.author.role}</p>
										</div>
									</div>
									<div>
										<Popover>
											<PopoverTrigger>
												<Button isIconOnly
														className="rounded-full bg-white border-2 border-gray-500 mr-4"
														aria-label="Options">
													<BsThreeDots className="text-medium" />
												</Button>
											</PopoverTrigger>

											<PopoverContent placement="bottom">
												<div className="flex flex-col py-2">
													<button
														onClick={() => console.log("Edit action triggered")}
														className="px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
													>
														Edit
													</button>
													<button
														onClick={handleDelete}
														className="px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
													>
														Delete
													</button>
												</div>
											</PopoverContent>
										</Popover>
									</div>

									<Button
										className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600"
										endContent={<MdOutlineKeyboardDoubleArrowRight />}
									>
										Continue
									</Button>
								</div>
							</div>
						</div>
					</div>
				))}

			</div>
			{isModalVisible && (
				<Modal isOpen={isModalVisible} onClose={cancelDelete}>
					<ModalContent>
						<ModalHeader>Confirm Deletion</ModalHeader>
						<div className="p-4 text-gray-700">
							Are you sure you want to delete this item? This action cannot be undone.
						</div>
						<ModalFooter>
							<Button className="bg-gray-500 text-white" onClick={cancelDelete}>
								Cancel
							</Button>
							<Button className="bg-red-500 text-white" onClick={confirmDelete}>
								Delete
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}
		</div>
	);
};
export default MyCourse;
