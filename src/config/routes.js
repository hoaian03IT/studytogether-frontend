import { lazy } from "react";
import { pathname } from "../routes";
import PrimaryLayout from "../layouts/primary-layout";
import SecondaryLayout from "../layouts/secondary-layout";
import ThirdLayout from "../layouts/third-layout";
import ProfileLayout from "../layouts/profile-layout";

// import page bằng react lazy
const HomePage = lazy(() => import("../screen/home.jsx"));
const SignInPage = lazy(() => import("../screen/sign-in"));
const ForgotPasswordPage = lazy(() => import("../screen/forgot-password"));
const ChangePasswordPage = lazy(() => import("../screen/change-password"));
const ForgotSuccessfullyPage = lazy(() =>
	import("../screen/forgot-password-successfully"),
);
const SignUpPage = lazy(() => import("../screen/sign-up"));
const ProfilePage = lazy(() => import("../screen/profile"));
const CreateCourse = lazy(() => import("../screen/create-course"));
const ListCourse = lazy(() => import("../screen/list-course"));
const AddVocab = lazy(() => import("../screen/course-vocabulary.jsx"));
const EditCourse = lazy(() => import("../screen/edit-course"));
const ListExamples = lazy(() => import("../screen/list-examples"));
const Purchase = lazy(() => import("../screen/course-purchase"));
const Business = lazy(() => import("../screen/course-business"));
const CourseInformation = lazy(() =>
	import("../screen/course-information.jsx"),
);
const FlashCard = lazy(() => import("../screen/flash-card.jsx"));
const ListExercise = lazy(() => import("../screen/list-excercise.jsx"));
const PersonalStatics = lazy(() => import("../screen/personal-statics.jsx"));
const LearnPage = lazy(() => import("../screen/learn.jsx"));
const FillInBlankPage = lazy(() => import("../screen/fill-in-blank.jsx"));
const MyCourse = lazy(() => import("../screen/my-course.jsx"));

export const publicRoutes = [
	{ path: pathname.home, component: HomePage, layout: PrimaryLayout },
	{ path: pathname.signIn, component: SignInPage, layout: SecondaryLayout },
	{
		path: pathname.forgotPassword,
		component: ForgotPasswordPage,
		layout: null,
	},
	{
		path: pathname.changePassword,
		component: ChangePasswordPage,
		layout: null,
	},
	{
		path: pathname.changePasswordSuccessfully,
		component: ForgotSuccessfullyPage,
		layout: null,
	},
	{ path: pathname.signUp, component: SignUpPage, layout: SecondaryLayout },
	{ path: pathname.profile, component: ProfilePage, layout: ProfileLayout },
	{
		path: pathname.createCourse,
		component: CreateCourse,
		layout: PrimaryLayout,
	},
	{ path: pathname.listCourse, component: ListCourse, layout: PrimaryLayout },
	{
		path: pathname.courseVocabulary,
		component: AddVocab,
		layout: ThirdLayout,
	},
	{ path: pathname.courseBusiness, component: Business, layout: ThirdLayout },
	{
		path: pathname.courseInformation,
		component: CourseInformation,
		layout: PrimaryLayout,
	},
	{ path: pathname.payment, component: Purchase, layout: PrimaryLayout },
	{ path: pathname.editCourse, component: EditCourse, layout: ThirdLayout },
	{
		path: pathname.courseVocabulary,
		component: AddVocab,
		layout: PrimaryLayout,
	},
	{
		path: pathname.listExamples,
		component: ListExamples,
		layout: ThirdLayout,
	},
	{
		path: pathname.flashCard,
		component: FlashCard,
		layout: PrimaryLayout,
	},
	{
		path: pathname.listExercise,
		component: ListExercise,
		layout: ThirdLayout,
	},
	{
		path: pathname.personalStatics,
		component: PersonalStatics,
		layout: PrimaryLayout,
	},
	{ path: pathname.learn, component: LearnPage, layout: null },
	{ path: pathname.fillInBlank, component: FillInBlankPage, layout: null },
	{ path: pathname.myCourse, component: MyCourse, layout: PrimaryLayout },
];
