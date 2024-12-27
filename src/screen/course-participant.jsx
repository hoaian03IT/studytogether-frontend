import React, { Fragment, useContext, useState } from "react";
import { Button, Card, CardBody, Progress, Select, SelectItem, user } from "@nextui-org/react";
import { VscDebugRestart } from "react-icons/vsc";
import { FaSquare } from "react-icons/fa";
import { FaCheck, FaUser } from "react-icons/fa6";
import { RxLightningBolt } from "react-icons/rx";
import { Image } from "@nextui-org/image";
import { useQuery, useQueryErrorResetBoundary } from "@tanstack/react-query";
import { queryKeys } from "../react-query/query-keys";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { EnrollmentService } from "../apis/enrollment.api";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { CourseService } from "../apis/course.api";
import { FaUserGraduate } from "react-icons/fa6";
import { IoBulbOutline, IoSpeedometerOutline } from "react-icons/io5";
import { PiHandFistLight } from "react-icons/pi";
import { pathname } from "../routes";
import bannerRank1 from "../assets/banner-rank1.png";
import bannerRank2 from "../assets/banner-rank2.png";
import bannerRank3 from "../assets/banner-rank3.png";
import bannerRank4 from "../assets/banner-rank4.png";

const CourseParticipant = () => {
	const params = useParams();

	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);

	const [formValue, setFormValue] = useState({
		optionId: "",
	});

	const [learntWords, setLearntWords] = useState([]);
	const [prepareWords, setPrepareWords] = useState([]);
	const [progress, setProgress] = useState({
		learnt: 0,
		total: 0,
	});
	const [pointList, setPointList] = useState({ competitors: [], yours: [] });

	const courseInfoQuery = useQuery({
		queryKey: [queryKeys.courseInfo, params?.courseId],
		queryFn: async ({ queryKey }) => {
			try {
				return await CourseService.fetchCourseInformation(queryKey[1], user, updateUserState);
			} catch (error) {
				if (error.response.data?.errorCode === "COURSE_NOT_FOUND") {
					navigate(pathname.notFound);
				}
				return null;
			}
		},
		enabled: !!params?.courseId && user?.isLogged,
	});

	const competitorPointsQuery = useQuery({
		queryKey: [queryKeys.competitorPoints, params?.courseId],
		queryFn: async ({ queryKey }) => {
			try {
				const data = await EnrollmentService.fetchCompetitorPoints(queryKey[1], user, updateUserState);
				setPointList({
					competitors: data?.["competitorPoints"] || [],
					yours: data?.["yourPoints"] || [],
				});
				return data;
			} catch (error) {
				if (error.response.data?.errorCode === "COURSE_NOT_FOUND") {
					navigate(pathname.notFound);
				}
				return null;
			}
		},
		enabled: !!params?.courseId && user?.isLogged,
	});

	const enrollmentProgressQuery = useQuery({
		queryKey: [queryKeys.enrollmentProgress, params?.courseId],
		queryFn: async ({ queryKey }) => {
			try {
				const data = await EnrollmentService.fetchEnrollmentProgress(queryKey[1], user, updateUserState);
				const enrollmentInfo = data?.["enrollmentInformation"];
				setLearntWords(enrollmentInfo?.["learntWords"] || []);
				setPrepareWords(enrollmentInfo?.["preparedToLearnWords"] || []);
				setProgress({
					learnt: Number(enrollmentInfo?.["numberLearntWords"]) || 0,
					total: Number(enrollmentInfo?.["numberTotalWords"]) || 0,
				});
				return enrollmentInfo;
			} catch (error) {
				if (error.response.data?.errorCode === "COURSE_NOT_FOUND") {
					navigate(pathname.notFound);
				}
				return null;
			}
		},
		enabled: !!params?.courseId && user?.isLogged,
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormValue({
			...formValue,
			[name]: value,
		});
	};

	const handleChange1 = (event) => {
		setSelectedOption1(event.target.value);
	};

	const handleChange2 = (event) => {
		setSelectedOption2(event.target.value);
	};

	const handleChange3 = (event) => {
		setSelectedOption3(event.target.value);
	};
	return (
		<Fragment>
			<div className="bg-primary ">
				<div className="flex items-start gap-5 ml-5 p-[40px]">
					<Image
						className="w-32 h-24 object-cover object-center mb-3 mt-5"
						width={300}
						alt={courseInfoQuery.data?.["name"]}
						src={courseInfoQuery.data?.["image"]}
					/>
					<div>
						<h1 className="text-xl mt-12">{courseInfoQuery.data?.["name"]}</h1>
						<p>
							{courseInfoQuery.data?.["target language"]}&nbsp;-&nbsp;
							{courseInfoQuery.data?.["course level name"]}
						</p>
					</div>
				</div>
			</div>
			<div className="flex items-center bg-white border-b-gray-700 gap-8 border-[2px] px-[40px] py-4  w-full">
				<div className="flex-1 flex flex-col">
					<div className="m-[10px] font-mono">
						<p>
							{progress.learnt}/{progress.total} words in long-term memory
						</p>
					</div>
					<div className="flex w-full bg-gray-300 rounded-full h-4 m-[10px] ">
						<Progress
							color={progress.learnt / progress.total >= 1 ? "success" : "warning"}
							aria-label="Enrollment progress"
							minValue={0}
							maxValue={enrollmentProgressQuery.data?.["numberTotalWords"]}
							value={enrollmentProgressQuery.data?.["numberLearntWords"]}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					{prepareWords.length > 0 && (
						<Button
							as={Link}
							to={pathname.learn + "?ci=" + params?.courseId}
							size="lg"
							className="flex items-center justify-start gap-2"
							color="primary">
							<IoBulbOutline className="size-5" />
							<span>Learn new words</span>
						</Button>
					)}
					{learntWords.length > 0 && (
						<Button
							as={Link}
							to={pathname.speedReview + "?ci=" + params?.courseId}
							size="lg"
							className="flex items-center justify-start gap-2"
							color="secondary">
							<IoSpeedometerOutline className="size-5" />
							<span>Speed review</span>
						</Button>
					)}
					{learntWords.length > 0 && (
						<Button
							as={Link}
							size="lg"
							className="flex items-center justify-start gap-2 bg-third text-white">
							<PiHandFistLight className="size-5" />
							<span>Practice exercises</span>
						</Button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-4 px-[50px] space-x-8">
				<div className="col-span-3 flex flex-col py-2 space-y-8">
					<div>
						<label className="font-semibold">Prepare to learn</label>
						{prepareWords.length > 0 ? (
							prepareWords.map((item) => (
								<div
									key={item?.["word id"]}
									className="flex flex-col justify-between w-full mt-[20px] p-[5px]">
									<div className="grid grid-cols-4 px-2">
										<h3>{item?.word}</h3>
										<p>{item?.definition}</p>
										<p>({item?.type})</p>
										<p>{item?.transcription}</p>
									</div>
									<hr className="border-t-2 border-gray-400 w-[100%]" />
								</div>
							))
						) : (
							<p className="font-light italic text-gray-600 text-center">There are no words to learn</p>
						)}
					</div>
					<div>
						<label className="font-semibold">Learnt words</label>
						{learntWords.length > 0 ? (
							learntWords.map((item) => (
								<div
									key={item?.["word id"]}
									className="flex flex-col justify-between w-full mt-[20px] p-[5px]">
									<div className="grid grid-cols-4 px-2">
										<h3>{item?.word}</h3>
										<p>{item?.definition}</p>
										<p>({item?.type})</p>
										<p>{item?.transcription}</p>
									</div>
									<hr className="border-t-2 border-gray-400 w-[100%]" />
								</div>
							))
						) : (
							<p className="font-light italic text-gray-600 text-center">
								You have not learnt any words yet
							</p>
						)}
					</div>
				</div>
				<div className="py-2">
					<label className="font-semibold">Learnt words</label>

					<div className="flex items-center justify-between px-4">
						<span>Users</span>
						<span>Points</span>
					</div>
					{pointList.competitors.map((item, index) => (
						<div
							key={index}
							className="flex items-center justify-between py-4 px-6 gap-2"
							style={{
								backgroundImage: `url(${
									index + 1 === 1
										? bannerRank1
										: index + 1 === 2
										? bannerRank2
										: index + 1 === 3
										? bannerRank3
										: bannerRank4
								})`,
								backgroundSize: "100% 100%",
							}}>
							<div className="flex items-center gap-4">
								{index === 0 ? <FaUserGraduate className="size-5" /> : <FaUser className="size-5" />}
								<span>{item?.["username"] === user.info?.username ? "You" : item?.["username"]}</span>
							</div>
							{item?.["points"]}
						</div>
					))}
					{pointList.competitors.findIndex((item) => item?.username === pointList.yours[0]?.["username"]) <
						0 && (
						<div className="flex items-center justify-between py-4 px-6 gap-2">
							<div className="flex items-center gap-4">
								{pointList.competitors.length === 0 ? (
									<FaUserGraduate className="size-5" />
								) : (
									<FaUser className="size-5" />
								)}
								<span>You</span>
							</div>
							{pointList.yours[0]?.["points"]}
						</div>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default CourseParticipant;
