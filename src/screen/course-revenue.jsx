import React, { useContext, useEffect, useState } from "react";
import { Progress, Tabs, Tab } from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaFlag, FaCommentAlt } from "react-icons/fa";
import { FaStar, FaCommentDots, FaShoppingCart } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";
import { CourseService } from "../apis/course.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../react-query/query-keys";
import { USDollar } from "../utils/currency";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { CommentService } from "../apis/comment.api";
import { Rating } from "../components/rating";
import { convertUTCToLocalTime } from "../utils/convert-utc-to-local-time";
import { RevenueChart } from "../components/revenue-chart";

const Revenue = ({ courseId, price }) => {
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);

	const [totalRevenue, setTotalRevenue] = useState(0);
	const [rates, setRates] = useState([]);
	const [tab, setTab] = useState("day");

	const courseInfoQuery = useQuery({
		queryKey: [queryKeys.courseInfo, courseId],
		queryFn: async ({ queryKey }) => {
			try {
				return await CourseService.fetchCourseInformation(queryKey[1], user, updateUserState);
			} catch (error) {
				toast.error(translation(error.response.data?.errorCode));
			}
		},
	});

	const courseRateQuery = useQuery({
		queryKey: [queryKeys.courseRate, courseId],
		queryFn: async ({ queryKey }) => {
			try {
				const data = await CommentService.fetchCourseRate(queryKey[1]);

				setRates(Object.entries(data?.rates));

				return data;
			} catch (error) {
				toast.error(translation(error.response?.data?.errorCode));
			}
		},
		enabled: !!courseId,
	});

	const courseRevenueQuery = useQuery({
		queryKey: [queryKeys.courseRevenue, courseId],
		queryFn: async ({ queryKey }) => {
			try {
				const { list } = await CourseService.fetchCourseRevenue(queryKey[1], user, updateUserState);
				const sum = list.reduce((acc, curr) => acc + curr?.amount * (1 - curr?.["commission rate"]), 0);
				setTotalRevenue(sum);
				return list;
			} catch (error) {
				toast.error(translation(error.response?.data?.errorCode));
			}
		},
		enabled: !!courseId,
	});

	const statsData = [
		{
			icon: <BsFillPeopleFill className="text-red-500 text-2xl" />,
			value: courseInfoQuery.data?.["n_enrollments"],
			label: "Students enrolled",
		},
		{
			icon: <FaFlag className="text-green-500 text-2xl" />,
			value: courseInfoQuery.data?.["course level name"],
			label: "Course level",
		},
		{
			icon: <FaCommentAlt className="text-purple-500 text-2xl" />,
			value: courseRateQuery.data?.numberComments,
			label: "Total Comments",
		},
	];

	return (
		<div>
			<div className="max-w-4xl mt-10">
				<div className="bg-white rounded-lg p-4 shadow-lg border mb-6">
					<div className="flex">
						{/* Left Section: Image */}
						<div className="flex-shrink-0">
							<Image
								alt={courseInfoQuery.data?.["name"]}
								src={courseInfoQuery.data?.["image"]}
								className="w-40 h-40 rounded-lg object-cover"
							/>
						</div>

						{/* Right Section: Content */}
						<div className="flex-grow pl-6">
							{/* Dates */}
							<div className="flex gap-16">
								<h3 className="text-sm text-gray-500 mb-1">
									Created at:&nbsp;
									{convertUTCToLocalTime(courseInfoQuery.data?.["created at"]).toLocaleDateString()}
								</h3>
								<h3 className="text-sm text-gray-500 mb-1 ml-4">
									Updated at:&nbsp;
									{convertUTCToLocalTime(courseInfoQuery.data?.["updated at"]).toLocaleDateString()}
								</h3>
							</div>
							{/* Course Title */}
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								{courseInfoQuery.data?.["name"]}
							</h3>

							{/* Author Info */}
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center">
									<div className="flex items-center text-sm text-gray-500 ml-2 gap-2">
										<Rating
											value={Number(courseRateQuery.data?.["averageRate"])}
											stars={5}
											size="sm"
										/>
										{courseRateQuery.data?.["averageRate"]} ({courseRateQuery.data?.["numberRates"]}
										&nbsp; Ratings)
									</div>
								</div>
							</div>

							{/* Course Details */}
							<div className="grid grid-cols-3 gap-1 items-center">
								{/* Course Price */}
								<div>
									<p className="text-sm font-semibold text-gray-600">Course Price:</p>
									<p className="text-xl font-bold text-gray-800">{USDollar.format(price)}</p>
								</div>
								{/* Revenue */}
								<div>
									<p className="text-sm font-semibold text-gray-600">USD Dollar Revenue:</p>
									<p className="text-xl font-bold text-gray-800">{USDollar.format(totalRevenue)}</p>
								</div>
							</div>

							{/* Withdraw Button */}
							{/* <div className="flex justify-end mt-4">
								<Button className="px-4 py-2 bg-orange-700 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600">
									Withdraw Money
								</Button>
							</div> */}
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-md">
				{statsData.map((stat, index) => (
					<div key={index} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
						<div className="p-2 rounded-lg bg-gray-100">{stat.icon}</div>
						<div className="ml-4">
							<p className="text-lg font-bold">{stat.value}</p>
							<p className="text-sm text-gray-500">{stat.label}</p>
						</div>
					</div>
				))}
			</div>

			<div className="bg-gray-50 p-6 rounded-lg shadow-md mt-6">
				<h3 className="text-xl font-bold mb-4">Overall Course Rating</h3>
				<div className="flex gap-6">
					{/* Left Section */}
					<div className="flex-1 flex flex-col items-center bg-orange-100 p-6 rounded-lg">
						<p className="text-4xl font-bold">{courseRateQuery.data?.["averageRate"]}</p>
						<Rating
							value={Number(courseRateQuery.data?.["averageRate"])}
							stars={5}
							size="sm"
							color="orange"
						/>
						<p className="text-gray-500 text-sm mt-2">Course Rating</p>
					</div>
					{/* Right Section */}
					<div className="flex-2 w-full">
						<div className="space-y-4">
							{rates?.map((arr, index) => (
								<div key={index} className="flex items-center gap-4">
									<Rating value={arr[0]} size="tiny" color="orange" />
									<Progress
										radius="sm"
										color="default"
										minValue={0}
										maxValue={courseRateQuery.data?.["numberRates"]}
										value={arr[1]}
									/>
									<p className="text-sm text-gray-500 w-12">
										{(Number(arr[1]) / Number(courseRateQuery.data?.["numberRates"])) * 100}%
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-6">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-bold">Recent Activity</h3>
				</div>
				<ul className="space-y-4">
					{activityData.map((activity) => (
						<li key={activity.id} className="flex items-start">
							<div className="p-3 bg-orange-100 rounded-lg">{activity.icon}</div>
							<div className="ml-4">
								<p className="text-sm text-gray-800">
									<span className="font-bold">{activity.user}</span> {activity.action}
									{activity.course && (
										<span className="font-semibold text-gray-700">"{activity.course}"</span>
									)}
								</p>
								<p className="text-xs text-gray-500">{activity.time}</p>
							</div>
						</li>
					))}
				</ul>
			</div> */}
			<div className="mt-10">
				<div id="chart">
					<Tabs selectedKey={tab} onSelectionChange={setTab}>
						<Tab key="day" title="Day" />
						<Tab key="week" title="Week" />
						<Tab key="month" title="Month" />
					</Tabs>
					<RevenueChart chartBy={tab} list={courseRevenueQuery.data} />
				</div>
			</div>
		</div>
	);
};

export { Revenue };
