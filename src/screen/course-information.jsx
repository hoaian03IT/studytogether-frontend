import { FaArrowLeftLong } from "react-icons/fa6";
import { Button, Link, Tab, Tabs, Tooltip, User } from "@nextui-org/react";
import { Fragment, useState } from "react";
import { USDollar } from "../utils/currency.js";
import { IoCartOutline, IoStopwatchOutline } from "react-icons/io5";
import { TbVocabulary } from "react-icons/tb";
import { HiOutlineCollection } from "react-icons/hi";
import { HiLanguage } from "react-icons/hi2";
import { FiUsers } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { CourseInformationDescription } from "../components/course-information-description.jsx";
import { CourseInformationContent } from "../components/course-information-content.jsx";
import { Link as LinkDom, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CourseInformationComment } from "../components/course-information-comment.jsx";
import { CourseService } from "../apis/course.api.js";

function CourseInformation() {
	const params = useParams();

	const [selectedTab, setSelectedTab] = useState("description");

	const courseInfoQuery = useQuery({
		queryKey: ["course-info", params?.courseId],
		queryFn: async ({ queryKey }) => {
			try {
				return await CourseService.fetchCourseInformation(queryKey[1]);
			} catch (error) {
				console.error(error);
			}
		},
	});

	const { data: courseInfo } = courseInfoQuery;

	const navigate = useNavigate();

	return <div className="m-6 grid grid-cols-1 gap-4">
		<div className="flex items-center bg-white p-2 rounded-md">
			<button className="flex items-center justify-center bg-primary rounded-full size-12"
					onClick={() => navigate(-1)}>
				<FaArrowLeftLong className="size-5" />
			</button>
			<h2 className="ms-4 uppercase font-bold">
				{courseInfo?.["name"]}
			</h2>
		</div>
		<div className="grid grid-cols-12 gap-6">
			<div
				style={{
					backgroundImage: `url(${courseInfo?.["image"]})`,
				}}
				className="bg-cover bg-center h-full min-h-96 rounded-md overflow-hidden col-span-8">
				<div
					className="h-full flex items-center justify-center flex-col space-y-4 bg-gradient-to-b from-transparent to-black">
					{!!courseInfo?.["price"] ? <Fragment>
						<p className="text-white text-xl font-bold">Purchase to continue this vocabulary course</p>
						<p className="text-gray-200 text-sm font-normal w-1/2 text-center">
							You need to buy to see full lessons of this course, thank you!
						</p>
						<Button className="bg-third text-third-foreground shadow-2xl" radius="sm">
							Buy now
						</Button>
					</Fragment> : <Fragment>
						<p className="text-white text-xl font-bold">This vocabulary course is free for you</p>
						<p className="text-gray-200 text-sm font-normal w-1/2 text-center">
							There are a lot of words waiting for you to learn
						</p>
						<Button className="bg-third text-third-foreground shadow-2xl" radius="sm">
							Join now
						</Button>
					</Fragment>
					}
				</div>
			</div>
			<div className="bg-white px-6 py-8 col-span-4 rounded-md flex flex-col justify-between">
				{!!courseInfo?.["price"] ? <Fragment>
						<div className="flex items-center">
							<span
								className="text-2xl font-bold">{USDollar.format(courseInfo?.["price"] * (1 - courseInfo?.["discount"] / 100))}</span>
							<span
								className="ms-2 text-sm text-gray-500 line-through">{USDollar.format(courseInfo?.["price"])}</span>
						</div>
						<div>
							<p className="p-1 inline-block text-sm uppercase bg-purple-600 text-white rounded-sm">{courseInfo?.["discount"]}%
								OFF</p>
						</div>
						<div className="mt-8 flex flex-col justify-center space-y-2">
							<Button className="bg-third text-third-foreground font-bold text-base" size="lg" radius="sm">Buy
								now</Button>
							<Button variant="bordered" className="font-bold text-base" size="lg" radius="sm"><IoCartOutline
								className="size-10" /> Add to
								list</Button>
						</div>
					</Fragment> :
					<Fragment>
						<div>
							<span
								className="p-1 inline-block text-sm uppercase bg-purple-600 text-white font-bold rounded-sm">Free</span>
							<span className="ml-1">for you</span>
						</div>
						<div className="mt-8 flex flex-col justify-center space-y-2">
							<Button className="bg-third text-third-foreground font-bold text-base" size="lg"
									radius="sm">Participate with us</Button>
						</div>
					</Fragment>}
				<div>
					<p className="flex items-center text-gray-600 mt-4"><TbVocabulary
						className="size-6 mr-4" />{courseInfo?.["n_levels"]}&nbsp;collections</p>
					<p className="flex items-center text-gray-600 mt-4"><HiOutlineCollection
						className="size-6 mr-4" />{courseInfo?.["n_words"]}&nbsp;words</p>
					<p className="flex items-center text-gray-600 mt-4"><IoStopwatchOutline
						className="size-6 mr-4" />15m per day</p>
					<p className="flex items-center text-gray-600 mt-4"><HiLanguage
						className="size-6 mr-4" />
						<strong className="font-semibold text-primary">{courseInfo?.["target language"]}</strong>
						&nbsp;for&nbsp;
						<strong className="font-semibold text-third">{courseInfo?.["source language"]}</strong>
					</p>
				</div>
			</div>
		</div>
		<div className="grid grid-cols-12 gap-6">
			<div className="col-span-8 p-6">
				<div>
					<h2 className="font-bold uppercase">{courseInfo?.["name"]}</h2>
					<div className="flex items-center justify-between py-4 border-b-1 border-b-gray-300">
						<User
							name={courseInfo?.["first name"] && courseInfo?.["last name"] ? `${courseInfo?.["first name"]} ${courseInfo?.["last name"]}` : courseInfo?.["username"]}
							description={(
								<Link as={LinkDom} href={`/profile/${courseInfo?.["username"]}`}
									  to={`/profile/${courseInfo?.["username"]}`}
									  size="sm" isExternal>
									@{courseInfo?.["username"]}
								</Link>
							)}
							avatarProps={{
								src: courseInfo?.["avatar image"],
							}} />
						<div className="flex space-x-4">
							<Tooltip content="Participants" placement="bottom" radius="sm">
								<div className="flex items-center cursor-default">
									<div className="bg-third rounded-full size-6 flex items-center justify-center">
										<FiUsers className="text-third-foreground" />
									</div>
									<span className="ms-1 text-sm">{courseInfo?.["n_enrollments"]}</span>
								</div>
							</Tooltip>
							<Tooltip content="Feedbacks" placement="bottom" radius="sm">
								<div className="flex items-center cursor-default">
									<div
										className="bg-third rounded-full size-6 flex items-center justify-center">
										<LuPencilLine className="text-third-foreground" />
									</div>
									<span className="ms-1 text-sm">{courseInfo?.["n_feedbacks"]}</span>
								</div>
							</Tooltip>
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
					{selectedTab === "description" && <CourseInformationDescription
						shortDescription={courseInfo?.["short description"]}
						detailedDescription={courseInfo?.["detailed description"]} />}
					{selectedTab === "content" && <CourseInformationContent courseId={params?.courseId} />}
					{selectedTab === "comment" && <CourseInformationComment courseId={params?.courseId}
																			authorUsername={courseInfo["username"]} />}
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