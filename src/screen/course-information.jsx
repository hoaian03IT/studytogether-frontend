import { FaArrowLeftLong } from "react-icons/fa6";
import { Button, Link, Tab, Tabs, Tooltip, User } from "@nextui-org/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { USDollar, VNDong } from "../utils/currency.js";
import { IoStopwatchOutline } from "react-icons/io5";
import { TbVocabulary } from "react-icons/tb";
import { HiOutlineCollection } from "react-icons/hi";
import { HiLanguage } from "react-icons/hi2";
import { FiUsers } from "react-icons/fi";
import { LuPencilLine } from "react-icons/lu";
import { CourseInformationDescription } from "../components/course-information-description.jsx";
import { CourseInformationContent } from "../components/course-information-content.jsx";
import { Link as LinkDom, Route, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseInformationComment } from "../components/course-information-comment.jsx";
import { CourseService } from "../apis/course.api.js";
import { queryKeys } from "../react-query/query-keys.js";
import { EnrollmentService } from "../apis/enrollment.api.js";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { pathname } from "../routes/index.js";
import { toast } from "react-toastify";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { SocketClientContext } from "../providers/socket-client-provider.jsx";
import { CommentService } from "../apis/comment.api.js";
import { Rating } from "../components/rating.jsx";
import { convertUTCToLocalTime } from "../utils/convert-utc-to-local-time.js";

function CourseInformation() {
	const params = useParams();
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);
	const { SocketHandler } = useContext(SocketClientContext);

	const clientQuery = useQueryClient();

	const [selectedTab, setSelectedTab] = useState("description");
	const [enrolled, setEnrolled] = useState(false);

	useEffect(() => {
		user?.isLogged &&
			EnrollmentService.fetchEnrollmentInfo(params?.courseId, user, updateUserState)
				.then((res) => {
					if (res.data?.["enrollment id"]) {
						setEnrolled(true);
					}
				})
				.catch(() => {
					setEnrolled(false);
				});
	}, [params?.courseId, updateUserState, user, user?.isLogged]);

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
		initialData: clientQuery.getQueryData([queryKeys.courseInfo, params?.courseId]),
		enabled: !clientQuery.getQueryData([queryKeys.courseInfo, params?.courseId]),
	});

	const coursePriceQuery = useQuery({
		queryKey: [queryKeys.coursePrice, params?.courseId],
		queryFn: async () => {
			try {
				return await CourseService.fetchCoursePrices(params?.courseId, user, updateUserState);
			} catch (error) {
				toast.error(translation(error.response?.data?.errorCode));
			}
		},
		initialData: clientQuery.getQueryData([queryKeys.coursePrice, params?.courseId]),
		enabled: !clientQuery.getQueryData([queryKeys.coursePrice, params?.courseId]),
	});

	const courseRateQuery = useQuery({
		queryKey: [queryKeys.courseRate, params?.courseId],
		queryFn: async ({ queryKey }) => {
			try {
				return await CommentService.fetchCourseRate(queryKey[1]);
			} catch (error) {
				toast.error(translation(error.response?.data?.errorCode));
			}
		},
		enabled: !!params?.courseId,
	});

	const courseSuggestionQuery = useQuery({
		queryKey: [queryKeys.courseSuggestion],
		queryFn: async () => {
			try {
				const data = await CourseService.fetchSuggestionCourse(
					{
						limit: 2,
						tag: courseInfoQuery.data?.["tag"],
					},
					user,
					updateUserState,
				);
				const courses = data?.courses.reduce((acc, course) => {
					if (
						!acc.some(
							(item) =>
								item?.["course id"] === course?.["course id"] ||
								item?.["course id"] === courseInfoQuery.data?.["course id"],
						)
					) {
						acc.push(course);
					}
					return acc;
				}, []);

				console.log(courses);
				return courses;
			} catch (error) {
				toast.error(translation(error.response?.data?.errorCode));
			}
		},
		enabled: !!courseInfoQuery.data?.["tag"],
	});

	const enrollMutation = useMutation({
		mutationFn: async () => {
			return await EnrollmentService.createEnrollment(params?.courseId, user, updateUserState);
		},
		onSuccess: (res) => {
			SocketHandler.handleEmitEnrollCourse(res.data?.["enrollment id"]);
			navigate(pathname.courseParticipant.split(":")[0] + params?.courseId);
		},
		onError: (error) => {
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	const handledPrice = coursePriceQuery.data?.["price"] * (1 - coursePriceQuery.data?.["discount"]);

	const navigate = useNavigate();

	const handleLearnOrBuy = () => {
		// neu nguoi dung la nguoi so huu khoa hoc
		if (courseInfoQuery.data?.["username"] === user.info?.username) {
			if (enrolled) {
				navigate(pathname.learn + "?ci=" + params?.courseId);
			} else {
				enrollMutation.mutate();
			}
		} else if (enrolled) {
			navigate(pathname.learn + "?ci=" + params?.courseId);
		} else if (handledPrice > 0) {
			navigate(pathname.payment.split(":")[0] + params?.courseId);
		} else {
			enrollMutation.mutate();
		}
	};

	return (
		<div className="m-6 grid grid-cols-1 gap-4">
			<div className="flex items-center bg-white p-2 rounded-md">
				<button
					className="flex items-center justify-center bg-primary rounded-full size-12"
					onClick={() => navigate(-1)}>
					<FaArrowLeftLong className="size-5" />
				</button>
				<h2 className="ms-4 uppercase font-bold">{courseInfoQuery.data?.["name"]}</h2>
			</div>
			<div className="grid grid-cols-12 gap-6">
				<div
					style={{
						backgroundImage: `url(${courseInfoQuery.data?.["image"]})`,
					}}
					className="bg-cover bg-center h-full min-h-96 rounded-md overflow-hidden col-span-8">
					<div className="h-full flex items-center justify-center flex-col space-y-4 bg-gradient-to-b from-transparent to-black">
						{!!coursePriceQuery.data?.["price"] ? (
							<Fragment>
								<p className="text-white text-xl font-bold">
									{translation("course-information.title-has-price1")}
								</p>
								<p className="text-gray-200 text-sm font-normal w-1/2 text-center">
									{translation("course-information.title-has-price2")}
								</p>
								{enrolled || courseInfoQuery.data?.["username"] === user.info?.username ? (
									<Button
										disabled={courseInfoQuery.data?.["status"] === "pending"}
										isDisabled={courseInfoQuery.data?.["status"] === "pending"}
										onClick={handleLearnOrBuy}
										isLoading={enrollMutation.isPending}
										className="bg-third text-third-foreground shadow-2xl"
										radius="sm">
										{translation("course-information.title-learn")}
									</Button>
								) : (
									<Button
										disabled={courseInfoQuery.data?.["status"] === "pending"}
										isDisabled={courseInfoQuery.data?.["status"] === "pending"}
										className="bg-third text-third-foreground shadow-2xl"
										radius="sm"
										onClick={handleLearnOrBuy}
										isLoading={enrollMutation.isPending}>
										{translation("course-information.title-buy")} -&nbsp;
										{coursePriceQuery.data?.["currency"] === "USD"
											? USDollar.format(handledPrice)
											: VNDong.format(handledPrice)}
									</Button>
								)}
							</Fragment>
						) : (
							<Fragment>
								<p className="text-white text-xl font-bold">
									{translation("course-information.title-no-price1")}
								</p>
								<p className="text-gray-200 text-sm font-normal w-1/2 text-center">
									{translation("course-information.title-no-price2")}
								</p>
								<Button
									disabled={courseInfoQuery.data?.["status"] === "pending"}
									isDisabled={courseInfoQuery.data?.["status"] === "pending"}
									className="bg-third text-third-foreground shadow-2xl"
									radius="sm"
									isLoading={enrollMutation.isPending}
									onClick={handleLearnOrBuy}>
									{enrolled || courseInfoQuery.data?.["username"] === user.info?.username
										? "Join now"
										: "Learn now"}
								</Button>
							</Fragment>
						)}
					</div>
				</div>
				<div className="bg-white px-6 py-8 col-span-4 rounded-md flex flex-col justify-between">
					{!!coursePriceQuery.data?.["price"] ? (
						<Fragment>
							{!enrolled && courseInfoQuery.data?.["username"] !== user.info?.username && (
								<Fragment>
									<div className="flex items-center">
										<span className="text-2xl font-bold">
											{coursePriceQuery.data?.["currency"] === "USD"
												? USDollar.format(handledPrice)
												: VNDong.format(handledPrice)}
										</span>
										{coursePriceQuery.data?.["discount"] > 0 && (
											<span className="ms-2 text-sm text-gray-500 line-through">
												{coursePriceQuery.data?.["currency"] === "USD"
													? USDollar.format(coursePriceQuery.data?.["price"])
													: VNDong.format(coursePriceQuery.data?.["price"])}
											</span>
										)}
									</div>
									{coursePriceQuery.data?.["discount"] > 0 && (
										<div>
											<p className="p-1 inline-block text-sm uppercase bg-purple-600 text-white rounded-sm">
												{coursePriceQuery.data?.["discount"] * 100}% OFF
											</p>
										</div>
									)}
								</Fragment>
							)}

							<div className="mt-8 flex flex-col justify-center space-y-2">
								{enrolled || courseInfoQuery.data?.["username"] === user.info?.username ? (
									<Button
										disabled={courseInfoQuery.data?.["status"] === "pending"}
										isDisabled={courseInfoQuery.data?.["status"] === "pending"}
										onClick={handleLearnOrBuy}
										isLoading={enrollMutation.isPending}
										className="bg-third text-third-foreground font-bold text-base"
										size="lg"
										radius="sm">
										{translation("course-information.title-learn")}
									</Button>
								) : (
									<Fragment>
										<Button
											disabled={courseInfoQuery.data?.["status"] === "pending"}
											isDisabled={courseInfoQuery.data?.["status"] === "pending"}
											className="bg-third text-third-foreground font-bold text-base"
											onClick={handleLearnOrBuy}
											isLoading={enrollMutation.isPending}
											size="lg"
											radius="sm">
											{translation("course-information.title-buy")}
										</Button>
										{/* <Button
											variant="bordered"
											className="font-bold text-base"
											size="lg"
											radius="sm">
											Add to whitelist
										</Button> */}
									</Fragment>
								)}
							</div>
						</Fragment>
					) : (
						<Fragment>
							<div>
								<span className="p-1 inline-block text-sm uppercase bg-purple-600 text-white font-bold rounded-sm">
									Free
								</span>
								<span className="ml-1">for you</span>
							</div>
							<div className="mt-8 flex flex-col justify-center space-y-2">
								<Button
									onClick={handleLearnOrBuy}
									isLoading={enrollMutation.isPending}
									className="bg-third text-third-foreground font-bold text-base"
									size="lg"
									radius="sm">
									Participate with us
								</Button>
							</div>
						</Fragment>
					)}
					<div>
						<p className="flex items-center text-gray-600 mt-4">
							<TbVocabulary className="size-6 mr-4" />
							{courseInfoQuery.data?.["n_levels"]}&nbsp;collections
						</p>
						<p className="flex items-center text-gray-600 mt-4">
							<HiOutlineCollection className="size-6 mr-4" />
							{courseInfoQuery.data?.["n_words"]}&nbsp;words
						</p>
						<p className="flex items-center text-gray-600 mt-4">
							<IoStopwatchOutline className="size-6 mr-4" />
							15m per day
						</p>
						<p className="flex items-center text-gray-600 mt-4">
							<HiLanguage className="size-6 mr-4" />
							<strong className="font-semibold text-primary">
								{courseInfoQuery.data?.["target language"]}
							</strong>
							&nbsp;for&nbsp;
							<strong className="font-semibold text-third">
								{courseInfoQuery.data?.["source language"]}
							</strong>
						</p>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-12 gap-6">
				<div className="col-span-8 p-6">
					<div>
						<div>
							<h2 className="font-bold uppercase">{courseInfoQuery.data?.["name"]}</h2>
							<Rating stars={5} value={courseRateQuery.data?.["averageRate"]} size="sm" color="yellow" />
						</div>
						<div className="flex items-center justify-between py-4 border-b-1 border-b-gray-300">
							<User
								name={
									courseInfoQuery.data?.["first name"] && courseInfoQuery.data?.["last name"]
										? `${courseInfoQuery.data?.["first name"]} ${courseInfoQuery.data?.["last name"]}`
										: courseInfoQuery.data?.["username"]
								}
								description={
									<Link
										as={LinkDom}
										href={`/profile/${courseInfoQuery.data?.["username"]}`}
										to={`/profile/${courseInfoQuery.data?.["username"]}`}
										size="sm"
										isExternal>
										@{courseInfoQuery.data?.["username"]}
									</Link>
								}
								avatarProps={{
									src: courseInfoQuery.data?.["avatar image"],
								}}
							/>
							<div className="flex space-x-4">
								<Tooltip content="Participants" placement="bottom" radius="sm">
									<div className="flex items-center cursor-default">
										<div className="bg-third rounded-full size-6 flex items-center justify-center">
											<FiUsers className="text-third-foreground" />
										</div>
										<span className="ms-1 text-sm">{courseInfoQuery.data?.["n_enrollments"]}</span>
									</div>
								</Tooltip>
								<Tooltip content="Comments" placement="bottom" radius="sm">
									<div className="flex items-center cursor-default">
										<div className="bg-third rounded-full size-6 flex items-center justify-center">
											<LuPencilLine className="text-third-foreground" />
										</div>
										<span className="ms-1 text-sm">{courseRateQuery.data?.numberRates}</span>
									</div>
								</Tooltip>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-md pt-2 mt-10">
						<Tabs
							variant="underlined"
							color="danger"
							selectedKey={selectedTab}
							onSelectionChange={setSelectedTab}
							size="lg">
							<Tab key="description" title="Description" />
							<Tab key="content" title="Course content" />
							<Tab key="comment" title="Comments" />
						</Tabs>
					</div>
					<div className="mt-6 px-4">
						{selectedTab === "description" && (
							<CourseInformationDescription
								shortDescription={courseInfoQuery.data?.["short description"]}
								detailedDescription={courseInfoQuery.data?.["detailed description"]}
							/>
						)}
						{selectedTab === "content" && <CourseInformationContent courseId={params?.courseId} />}
						{selectedTab === "comment" && (
							<CourseInformationComment
								courseId={params?.courseId}
								authorUsername={courseInfoQuery.data?.["username"]}
								enrolled={enrolled}
							/>
						)}
					</div>
				</div>
				<div className="col-span-4 space-y-4">
					{courseSuggestionQuery.data?.length > 0 &&
						courseSuggestionQuery.data?.slice(0, 2).map((course) => (
							<div
								key={course?.["course id"]}
								className="flex min-h-80 w-full rounded-md overflow-hidden">
								<div className="basis-[45%] bg-third p-6 flex flex-col justify-between">
									<p className="text-sm text-third-foreground">
										{convertUTCToLocalTime(course?.["created at"]).toDateString()}
									</p>
									<div>
										<p className="text-4xl text-third-foreground font-bold">{course?.["name"]}</p>
										<p className="text-third-foreground font-light">
											{course?.["first name"]} {course?.["last name"]}
										</p>
									</div>
									<Button
										as={LinkDom}
										to={pathname.courseInformation.split(":")[0] + course?.["course id"]}
										variant="bordered"
										size="sm"
										className="border-third-foreground text-third-foreground rounded-sm border-1">
										Get it Now
									</Button>
								</div>
								<div className="basis-[55%]">
									<img
										loading="lazy"
										draggable={false}
										className="w-full h-full object-center object-cover"
										src={course?.["image"]}
										alt=""
									/>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

export default CourseInformation;
