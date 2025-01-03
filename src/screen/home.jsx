import React, { Fragment, useContext, useEffect, useState } from "react";
import { Tooltip as NextTooltip, Card, CardBody } from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	BarElement,
	LinearScale,
	CategoryScale,
	Title,
	LineElement,
	PointElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../react-query/query-keys";
import { UserService } from "../apis/user.api";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { streakState } from "../recoil/atoms/streak.atom";
import { convertUTCToLocalTime } from "../utils/convert-utc-to-local-time";
import { Link } from "react-router-dom";
import { pathname } from "../routes";
import { CourseService } from "../apis/course.api";
import { CourseCard } from "../components/course-card";
import { MostPopularCourse } from "../components/most-popular";
import { MostDiscountCourse } from "../components/most-discount";
import clsx from "clsx";
import bannerVideo from "../assets/video/banner-video.mp4";
import { CalendarStreak } from "../components/calendar-streak";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function getLastMonthDays() {
	const today = new Date();
	const daysArray = [];

	for (let i = 0; i < 30; i++) {
		// Lấy 30 ngày trước
		const pastDate = new Date();
		pastDate.setDate(today.getDate() - i); // Trừ số ngày tương ứng
		daysArray.push(`${pastDate.getDate()}-${pastDate.getMonth() + 1}`); // Định dạng YYYY-MM-DD
	}

	return daysArray.reverse();
}

const Dashboard = () => {
	const user = useRecoilValue(userState);
	const streak = useRecoilValue(streakState);
	const { updateUserState } = useContext(GlobalStateContext);

	const [percentRightWord, setPercentRightWord] = useState(0);
	const [wordStatisticByLanguage, setWordStatisticsByByLanguage] = useState([]); // [{language: "en", learnt words: 20, wrong words: 5}]
	const [learntWordsInMonth, setLearntWordsInMonth] = useState([]); // [{word id: 43, word: "cashier", definition: "nhân viên thu ngân", type: "n", wrong times: 2}]
	const [mostConfusedWords, setMostConfusedWords] = useState([]); // [{word id: 42, repeatable: 0, wrong times: 0, created at: "2024-12-26T01:19:06.000Z"}]
	const [pointStatistic, setPointStatistic] = useState({
		totalPoints: 0,
		maxPointsOfCourse: {
			points: 0,
			courseId: "",
			courseName: "",
			courseImage: "",
			courseOwner: "",
		},
	});
	const [incompleteCourse, setIncompleteCourse] = useState([]);
	const [learntCourses, setLearntCourses] = useState(0);
	const [DoughnutChartData, setDoughnutChartData] = useState({
		labels: ["Wrong", "Right"],
		datasets: [
			{
				data: [0, 0],
				backgroundColor: ["#FF6636", "#5cc6ee"],
				borderWidth: 1,
			},
		],
	});
	const [BarChartData, setBarChartData] = useState({
		labels: [],
		datasets: [],
	});
	const [LineChartData, setLineChartData] = useState({ labels: [], datasets: [] });

	const userStatistic = useQuery({
		queryKey: [queryKeys.userStatistic],
		queryFn: async () => {
			const data = await UserService.fetchUserStatistics(user, updateUserState);
			initData(data);

			return data;
		},
		enabled: !!user?.isLogged,
		staleTime: 1000 * 60 * 10,
		cacheTime: 1000 * 60 * 15,
	});

	const finishedCourseQuery = useQuery({
		queryKey: [queryKeys.finishedCourses],
		queryFn: async () => {
			try {
				let data = await CourseService.fetchUnfinishedCourses(user, updateUserState);
				setIncompleteCourse(data?.incompleteCourses || []);
				return data;
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response.data?.errorCode));
			}
		},
		enabled: !!user?.isLogged,
	});

	useEffect(() => {
		if (userStatistic.data) initData(userStatistic.data);
	}, [userStatistic.data]);

	// update doughnut chart data
	useEffect(() => {
		const totalLearntWords = wordStatisticByLanguage?.reduce(
			(acc, word) => acc + Number(word?.["total learnt words"]),
			0,
		);
		const totalWrongsWords = wordStatisticByLanguage?.reduce(
			(acc, word) => acc + Number(word?.["total wrong words"]),
			0,
		);
		const totalRightsWords = totalLearntWords - totalWrongsWords;

		setPercentRightWord((totalRightsWords / totalLearntWords) * 100 || 0);

		setDoughnutChartData({
			...DoughnutChartData,
			datasets: [{ ...DoughnutChartData.datasets[0], data: [totalWrongsWords, totalRightsWords] }],
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wordStatisticByLanguage]);

	// update bar chart data
	useEffect(() => {
		const datasets = [
			{
				label: ["Total learnt"],
				data: [],
				backgroundColor: ["#5cc6ee"],
			},
			{
				label: ["Right words"],
				data: [],
				backgroundColor: ["#FF6636"],
			},
			{
				label: ["Wrong words"],
				data: [],
				backgroundColor: ["#9EDF9C"],
			},
		];

		for (let item of wordStatisticByLanguage) {
			const total = Number(item?.["total learnt words"]);
			const wrong = Number(item?.["total wrong words"]);
			// set data for 'total words' bar
			datasets[0].data.push(total);
			datasets[0].backgroundColor.push("#5cc6ee");
			// set data for 'right words' bar
			datasets[1].data.push(total - wrong);
			datasets[1].backgroundColor.push("#FF6636");
			// set data for 'wrong words' bar
			datasets[2].data.push(wrong);
			datasets[2].backgroundColor.push("#9EDF9C");
		}

		setBarChartData({
			labels: wordStatisticByLanguage.map((item) => item?.["language name"]),
			datasets: datasets,
		});
	}, [wordStatisticByLanguage]);

	// update line chart data
	useEffect(() => {
		const labels = getLastMonthDays();
		const data = {};

		labels.forEach((label) => {
			data[label] = 0;
		});

		learntWordsInMonth.forEach((item) => {
			const localDate = convertUTCToLocalTime(item?.["created at"]);
			let key = `${localDate.getDate()}-${localDate.getMonth() + 1}`;
			data[key] = Number(data[key]) + 1;
		});

		const datasets = Object.values(data);
		for (let i = 1; i < datasets.length; i++) {
			datasets[i] += datasets[i - 1];
		}

		setLineChartData({
			labels: labels,
			datasets: [
				{
					label: "Number words",
					data: datasets,
					fill: false,
					borderColor: "#5cc6ee",
					backgroundColor: "#5cc6ee",
					tension: 0.1,
				},
			],
		});
	}, [learntWordsInMonth]);

	const initData = (data) => {
		setWordStatisticsByByLanguage(data?.wordStatistics?.byLanguage);
		setLearntWordsInMonth(data?.wordStatistics?.wordsLearnedInMonth || []);
		setMostConfusedWords(data?.wordStatistics?.mostConfusedWords || []);
		setPointStatistic({
			totalPoints: data?.pointStatistic?.["total points"],
			maxPointsOfCourse: {
				courseId: data?.pointStatistic?.["course id"],
				courseImage: data?.pointStatistic?.image,
				courseName: data?.pointStatistic?.name,
				courseOwner: data?.pointStatistic?.username,
				points: data?.pointStatistic?.["max points"],
			},
		});
		setLearntCourses(data?.courseStatistic?.numberEnrolledCourse);
	};

	return (
		<div className="p-8">
			{user.isLogged ? (
				<Fragment>
					<span className="text-2xl font-bold mt-6 text-primary-500">Statistic</span>
					<div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg shadow-md mb-4">
						<div className="col-span-1 w-full flex flex-col justify-start">
							<label className="text-xl">Percent correct</label>
							<div className="relative flex justify-center h-48 text-center">
								<div>
									<Doughnut
										className="h-full"
										data={DoughnutChartData}
										options={{
											cutout: "70%", // Donut size
										}}
									/>
								</div>
								<div className="absolute inset-0 flex items-center justify-center">
									<h2 className="text-2xl text-center font-semibold text-gray-700">
										{Math.round(percentRightWord)}%
										<br /> correct
									</h2>
								</div>
							</div>
							<div className="text-center">
								<p className="text-gray-600">
									You have learnt&nbsp;
									<strong className="font-bold text-lg text-primary">
										{wordStatisticByLanguage.reduce(
											(acc, word) => acc + Number(word?.["total learnt words"]),
											0,
										)}
										&nbsp;
									</strong>
									words in <strong className="font-bold text-lg text-primary">{learntCourses}</strong>
									&nbsp; courses
								</p>
								<p className="text-secondary">
									{learntCourses > 100
										? "🔥 That's amazing! Let's try your best! 🔥"
										: "💪 Keep going! You can do better 💪"}
								</p>
							</div>
						</div>
						<div className="col-span-1">
							<label className="text-xl">Percent correct by language</label>
							<Bar
								className="w-full"
								options={{
									plugins: {},
									responsive: true,
									interaction: {
										mode: "index",
										intersect: false,
									},
								}}
								data={BarChartData}
							/>
						</div>
						<div className="col-span-1 flex justify-center gap-4 mt-8 md:mt-0">
							<div className="text-center space-y-4">
								<label className="text-xl">Your Streak</label>
								<NextTooltip radius="sm" content="Your current streak">
									<p className="text-3xl">{streak.currentStreak}🔥</p>
								</NextTooltip>
								<NextTooltip radius="sm" content="Your max streak">
									<p className="">
										Best streak:&nbsp;
										<strong className="text-secondary text-xl">{streak.maxStreak}</strong>
									</p>
								</NextTooltip>
							</div>
							<CalendarStreak />
						</div>
					</div>
					<div className="grid grid-cols-8 gap-4 bg-gray-50 p-4 rounded-lg shadow-md mb-4">
						<div
							className={clsx(
								mostConfusedWords.length > 0 || pointStatistic.totalPoints
									? "col-span-6"
									: "col-span-8",
							)}>
							<label className="text-xl">Your learning statistics</label>
							<Line
								options={{
									responsive: true,
									plugins: {
										legend: {
											position: "top",
										},
									},
								}}
								data={LineChartData}
							/>
						</div>
						<div className="col-span-2 space-y-6 flex flex-col">
							{mostConfusedWords.length > 0 && (
								<div className="h-1/2">
									<label className="text-xl">Most confused words</label>
									<Card radius="sm" shadow="sm" className="mt-4">
										<CardBody>
											{mostConfusedWords.map((item) => (
												<div key={item?.["word id"]} className="py-1">
													<span>{item?.["word"]}&nbsp;</span>
													<span>({item?.["type"]}):&nbsp;</span>
													<span>{item?.["definition"]}</span>
												</div>
											))}
										</CardBody>
									</Card>
								</div>
							)}
							{pointStatistic.totalPoints && (
								<div className="h-1/2">
									<label className="text-xl">Point statistic</label>
									<p className="mt-4">
										Total achieved points:&nbsp;&nbsp;
										<strong className="text-secondary text-xl">{pointStatistic.totalPoints}</strong>
									</p>
									<p>
										You earned&nbsp;
										<strong className="text-secondary text-xl">
											{pointStatistic.maxPointsOfCourse.points}
										</strong>
										&nbsp;in&nbsp;
										<strong className="text-primary italic">
											{pointStatistic.maxPointsOfCourse.courseName}
										</strong>
									</p>
									<Card radius="sm" shadow="sm" className="mt-4">
										<CardBody>
											<Link
												to={
													pathname.courseParticipant.split(":")[0] +
													pointStatistic.maxPointsOfCourse.courseId
												}
												className="flex items-center gap-4">
												<Image
													src={pointStatistic.maxPointsOfCourse.courseImage}
													className="size-20 border-1 border-gray-300 rounded-small"
												/>
												<div>
													<h3 className="text-lg font-light text-gray-800">
														{pointStatistic.maxPointsOfCourse.courseName}
													</h3>
													<p className="font-light">
														Created by:&nbsp;
														<strong className="text-primary">
															{pointStatistic.maxPointsOfCourse.courseOwner}
														</strong>
													</p>
												</div>
											</Link>
										</CardBody>
									</Card>
								</div>
							)}
						</div>
					</div>
					<span className="text-2xl font-bold mt-6 text-primary-500">Recent Courses</span>
					<div className="grid grid-cols-3 gap-4 my-4">
						{incompleteCourse.map((item) => (
							<CourseCard key={item?.["enrollment id"]} item={item} />
						))}
					</div>
				</Fragment>
			) : (
				<div className="w-full">
					<video className="w-full h-[500px] object-cover object-center rounded-small" autoPlay muted loop>
						<source src={bannerVideo} srcSet={bannerVideo} type="video/mp4" />
					</video>
				</div>
			)}
			<span className="text-2xl font-bold mt-6 text-primary-500">Most popular Courses</span>
			<div className="py-4 grid xl:grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
				<MostPopularCourse limit="8" />
			</div>

			<span className="text-2xl font-bold mt-6 text-primary-500">Top most discount</span>
			<div className="py-4 grid xl:grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
				<MostDiscountCourse limit="4" />
			</div>
		</div>
	);
};

export default Dashboard;
