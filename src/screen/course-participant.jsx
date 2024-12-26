import React, { Fragment, useContext, useState } from "react";
import { Select, SelectItem, user } from "@nextui-org/react";
import { VscDebugRestart } from "react-icons/vsc";
import { FaSquare } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { RxLightningBolt } from "react-icons/rx";
import { Image } from "@nextui-org/image";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../react-query/query-keys";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { EnrollmentService } from "../apis/enrollment.api";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { CourseService } from "../apis/course.api";

const CourseParticipant = () => {
	const listVocal = [
		{
			word: "Dang An",
			translate: "Rắn độc chúa",
			status: "now",
			logo: <FaCheck />,
		},
		{
			word: "Le Duy",
			translate: "Rắn độc cha",
			status: "now",
			logo: <FaCheck />,
		},
		{
			word: "Công Thành",
			translate: "Rắn độc con",
			status: "",
			logo: <RxLightningBolt />,
		},
	];

	const params = useParams();

	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);

	const [formValue, setFormValue] = useState({
		optionId: "",
	});

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
				return await EnrollmentService.fetchEnrollmentProgress(queryKey[1], user, updateUserState);
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

	const [selectedOption1, setSelectedOption1] = useState("");
	const [selectedOption2, setSelectedOption2] = useState("");
	const [selectedOption3, setSelectedOption3] = useState("");

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
			<div className="flex flex-col bg-white border-b-gray-700 border-[2px] p-[40px]  w-full">
				<div className="flex flex-col">
					<div className="m-[10px] font-mono">
						<p>680/700 words in long-term memory</p>
					</div>
					<div className="flex w-full bg-gray-300 rounded-full h-4 m-[10px] ">
						<div className="bg-yellow-500 h-4 rounded-full" style={{ width: `${90}%` }}></div>
					</div>
				</div>
				<div className="flex flex-row ml-7 ">
					<div>
						<Select
							size="lg"
							label="Option"
							className="w-40"
							radius="sm"
							isRequired
							value={formValue.optionId}
							onChange={handleInputChange}
							name="optionId">
							<SelectItem key="Restart" startContent={<VscDebugRestart />}>
								Restart
							</SelectItem>
							<SelectItem key="Quit" startContent={<FaSquare />}>
								Quit
							</SelectItem>
						</Select>
					</div>
				</div>
				<div className="flex flex-row m-[30px] justify-center p-[20px] gap-[250px]">
					<div className="flex gap-2 items-center">
						<p className="font-mono">Ready to review</p>
						<FaCheck />
					</div>
					<div className="flex gap-2">
						<p className="font-mono">Ready to learn</p>
						<RxLightningBolt />
					</div>
				</div>

				<div className="flex flex-col p-[10px] m-[30px]">
					{listVocal.map((item, index) => (
						<div key={index} className="flex flex-col justify-between w-full mt-[20px] p-[5px]">
							<div className="grid grid-cols-3 gap-8 ">
								<div>
									<h3>{item.word}</h3>
								</div>
								<div>
									<h3>{item.translate}</h3>
								</div>
								<div className="flex gap-2 items-center">
									<h3>{item.status}</h3>
									<p>{item.logo}</p>
								</div>
							</div>
							<hr className="border-t-2 border-gray-400 my-5 w-[100%]" />
						</div>
					))}
				</div>
			</div>
		</Fragment>
	);
};

export default CourseParticipant;
