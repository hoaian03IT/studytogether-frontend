import { lazy } from "react";
import { pathname } from "../routes";
import PrimaryLayout from "../layouts/primary-layout";
import SecondaryLayout from "../layouts/secondary-layout";
import ProfileLayout from "../layouts/profile-layout";

// import page bằng react lazy
const HomePage = lazy(() => import("../screen/homepage"));
const SignInPage = lazy(() => import("../screen/sign-in"));
const ForgotPasswordPage = lazy(() => import("../screen/forgot-password"));
const ChangePasswordPage = lazy(() => import("../screen/change-password"));
const ForgotSuccessfullyPage = lazy(() => import("../screen/forgot-password-successfully"));
const SignUpPage = lazy(() => import("../screen/sign-up"));
const ProfilePage = lazy(() => import("../screen/profile"));
const CreateCourse = lazy(() => import("../screen/create-course"));
const ListCourse = lazy(() => import("../screen/list-course"));
const AddVocab = lazy(() => import("../screen/add-vocab"));

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
    { path: pathname.addVocab, component: AddVocab, layout: PrimaryLayout },
];
