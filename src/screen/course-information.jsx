import { FaArrowLeftLong } from "react-icons/fa6";
import { Button, Tab, Tabs, User } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { USDollar } from "../utils/currency.js";
import { IoCartOutline, IoStopwatchOutline } from "react-icons/io5";
import { TbVocabulary } from "react-icons/tb";
import { HiOutlineCollection } from "react-icons/hi";
import { HiLanguage } from "react-icons/hi2";
import { FiUsers } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { CourseInformationDescription } from "../components/course-information-description.jsx";
import { CourseInformationContent } from "../components/course-information-content.jsx";
import clsx from "clsx";
import { CourseInformationFeedback } from "../components/course-information-feedback.jsx";

function CourseInformation() {
	const [selectedTab, setSelectedTab] = useState("description");

	useEffect(() => {
		console.log(selectedTab);
	}, [selectedTab]);

	return <div className="m-6 grid grid-cols-1 gap-4">
		<div className="flex items-center bg-white p-2 rounded-md">
			<button className="flex items-center justify-center bg-my-primary rounded-full size-12">
				<FaArrowLeftLong className="size-5" />
			</button>
			<h2 className="ms-4 uppercase font-bold">
				LEARNING HISTORICAL WORDS AND SENTENCES
			</h2>
		</div>
		<div className="grid grid-cols-12 gap-6">
			<div
				style={{
					backgroundImage: `url("https://t3.ftcdn.net/jpg/03/12/73/62/360_F_312736298_hZ50Vp4UBmWteln2WXxmT5WCuD8z6tRe.jpg")`,
				}}
				className="bg-cover bg-center h-full rounded-md overflow-hidden col-span-8">
				<div
					className="h-full flex items-center justify-center flex-col space-y-4 bg-gradient-to-b from-transparent to-black">
					<p className="text-white text-xl font-bold">Purchase to continue this vocabulary course</p>
					<p className="text-gray-200 text-sm font-normal w-1/2 text-center">
						You need to buy package webinar to see full lessons this course thank you
					</p>
					<Button className="bg-third text-third-foreground shadow-2xl" radius="sm">
						Buy now
					</Button>
				</div>
			</div>
			<div className="bg-white px-6 py-8 col-span-4 rounded-md">
				<div className="flex items-center">
					<span className="text-2xl font-bold">{USDollar.format(22.40)}</span>
					<span className="ms-2 text-sm text-gray-500 line-through">{USDollar.format(30.13)}</span>
				</div>
				<div>
					<p className="p-1 inline-block text-sm uppercase bg-purple-600 text-white rounded-sm">20%
						OFF</p>
				</div>
				<div className="mt-8 flex flex-col justify-center space-y-2">
					<Button className="bg-third text-third-foreground font-bold text-base" size="lg" radius="sm">Buy
						now</Button>
					<Button variant="bordered" className="font-bold text-base" size="lg" radius="sm"><IoCartOutline
						className="size-10" /> Add to
						list</Button>
				</div>
				<div>
					<p className="flex items-center text-gray-600 mt-4"><TbVocabulary className="size-6 mr-4" /> 22
						collections</p>
					<p className="flex items-center text-gray-600 mt-4"><HiOutlineCollection
						className="size-6 mr-4" /> 152 words</p>
					<p className="flex items-center text-gray-600 mt-4"><IoStopwatchOutline
						className="size-6 mr-4" /> 15m per day</p>
					<p className="flex items-center text-gray-600 mt-4"><HiLanguage
						className="size-6 mr-4" /> English
					</p>
				</div>
			</div>
		</div>
		<div className="grid grid-cols-12 gap-6">
			<div className="col-span-8 p-6">
				<div>
					<h2 className="font-bold">LEARNING HISTORICAL WORDS AND SENTENCES</h2>
					<div className="flex items-center justify-between py-4 border-b-1 border-b-gray-300">
						<User name="Nguoitaokhoa" />
						<div className="flex space-x-4">
							<div className="flex items-center">
								<div className="bg-third rounded-full size-6 flex items-center justify-center">
									<FiUsers className="text-third-foreground" />
								</div>
								<span className="ms-1 text-sm">2.4k</span>
							</div>
							<div className="flex items-center">
								<div
									className="bg-third rounded-full size-6 flex items-center justify-center">
									<LuPencilLine className="text-third-foreground" />
								</div>
								<span className="ms-1 text-sm">17</span>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-md pt-2 mt-10">
					<Tabs variant="underlined" color="danger" selectedKey={selectedTab}
						  onSelectionChange={setSelectedTab} size="lg">
						<Tab key="description" title="Description" />
						<Tab key="content" title="Course content" />
						<Tab key="comment" title="Comments" />
					</Tabs>
				</div>
				<div className="mt-6 px-4">
					<div className={clsx(selectedTab === "description" ? "block" : "hidden")}>
						<CourseInformationDescription
							shortDescription="About Course"
							detailedDescription="Vue (pronounced /vjuː/, like view) is a progressive framework for building user interfaces.
												  Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable.
												  The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects.
												  On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications
												  when used in combination with modern tooling and supporting libraries." />
					</div>
					<div className={clsx(selectedTab === "content" ? "block" : "hidden")}>
						<CourseInformationContent />
					</div>
					<div className={clsx(selectedTab === "comment" ? "block" : "hidden")}>
						<CourseInformationFeedback />
					</div>
				</div>
			</div>
			<div className="col-span-4">
				<div className="flex min-h-80 w-full rounded-md overflow-hidden">
					<div className="basis-[45%] bg-third p-6 flex flex-col justify-between">
						<p className="text-sm text-third-foreground">Webinar, <br /> August 16, 2020</p>
						<div>
							<p className="text-4xl text-third-foreground font-bold">Vocabulary for IT student</p>
							<p className="text-third-foreground font-light">Kitani Sarasvati</p>
						</div>
						<Button variant="bordered" size="sm"
								className="border-third-foreground text-third-foreground rounded-sm border-1">Get it
							Now</Button>
					</div>
					<div className="basis-[55%]">
						<img
							loading="lazy"
							draggable={false}
							className="w-full h-full object-center object-cover"
							src="https://peerreviewededucationblog.com/wp-content/uploads/2024/02/ai-autism.jpg"
							alt="" />
					</div>
				</div>
			</div>
		</div>
	</div>;
}

export default CourseInformation;