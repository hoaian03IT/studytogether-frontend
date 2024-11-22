import { lazy } from "react";
import { pathname } from "../routes";
import PrimaryLayout from "../layouts/primary-layout";
import SecondaryLayout from "../layouts/secondary-layout";
import ThirdLayout from "../layouts/third-layout";
import ProfileLayout from "../layouts/profile-layout";
import ListExerciseLayout from "../layouts/listexercise-layout.jsx";

// import page bằng react lazy
const HomePage = lazy(() => import("../screen/homepage"));
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
const AddVocab = lazy(() => import("../screen/add-vocab"));
const EditCourse = lazy(() => import("../screen/edit-course"));
const ListExamples = lazy(() => import("../screen/list-examples"));
const Purchase = lazy(() => import("../screen/course-purchase"));
const Business = lazy(() => import("../screen/course-business"));
const MulChoices = lazy(() => import("../screen/exercise-mc"));
const CourseInformation = lazy(() =>
	import("../screen/course-information.jsx"),
);
const FlashCard = lazy(() => import("../screen/flash-card.jsx"));
const ListExercise = lazy(() => import("../screen/list-excercise.jsx"));
const CourseParticipant = lazy(() =>
	import("../screen/course-participant.jsx"),
);
const NotificationComponent=lazy(() => import ("../screen/notification-component.jsx"));

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
	{ path: pathname.addVocab, component: AddVocab, layout: ThirdLayout },
	{ path: pathname.courseBusiness, component: Business, layout: ThirdLayout },
	{
		path: pathname.courseInformation,
		component: CourseInformation,
		layout: PrimaryLayout,
	},
	{ path: pathname.payment, component: Purchase, layout: PrimaryLayout },
	{ path: pathname.editCourse, component: EditCourse, layout: ThirdLayout },
	{ path: pathname.mulChoices, component: MulChoices, layout: PrimaryLayout },
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
		layout: ListExerciseLayout,
	},
	{ path: pathname.editCourse, component: EditCourse, layout: ThirdLayout },
	{
		path: pathname.courseParticipant,
		component: CourseParticipant,
		layout: PrimaryLayout,
	},
	{
		path:pathname.notificationComponent,
		component: NotificationComponent,
		
	},

];
