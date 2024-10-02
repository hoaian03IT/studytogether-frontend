import { lazy } from "react";
import { pathname } from "../routes";
import PrimaryLayout from "../layouts/primary-layout";
import SecondaryLayout from "../layouts/secondary-layout";

// import page bằng react lazy
const HomePage = lazy(() => import("../screen/homepage"));
const SignInPage = lazy(() => import("../screen/sign-in"));
const ForgotPasswordPage = lazy(() => import("../screen/forgot-password"));
const ResetPasswordPage = lazy(() => import("../screen/reset-password"));
const ResetPassSuccessfullyPage = lazy(() => import("../screen/reset-password-successfully"));
const SignUpPage = lazy(() => import("../screen/sign-up"));
const ProfilePage = lazy(() => import("../screen/profile"));
const ChangePasswordPage = lazy(() => import("../screen/change-password-page"));

export const publicRoutes = [
    { path: pathname.home, component: HomePage, layout: PrimaryLayout },
    { path: pathname.signIn, component: SignInPage, layout: SecondaryLayout },
    { path: pathname.forgotPassword, component: ForgotPasswordPage , layout: PrimaryLayout },
    { path: pathname.resetPassword, component: ResetPasswordPage , layout: PrimaryLayout },
    { path: pathname.resetPassSuccessfully, component: ResetPassSuccessfullyPage , layout: PrimaryLayout },
    { path: pathname.signUp, component: SignUpPage, layout: SecondaryLayout },
    { path: pathname.profile, component: ProfilePage, layout: PrimaryLayout },
    { path: pathname.changePasswordPage, component: ChangePasswordPage, layout: null },
];
