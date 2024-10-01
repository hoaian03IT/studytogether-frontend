import { lazy } from "react";
import { pathname } from "../routes";

// import page bằng react lazy
const HomePage = lazy(() => import("../screen/homepage"));
const SignInPage = lazy(() => import("../screen/sign-in"));
const ProfilePage = lazy(() => import("../screen/profile"));

export const publicRoutes = [
    { path: pathname.home, component: HomePage, layout: null },
    { path: pathname.signIn, component: SignInPage, layout: null },
    { path: pathname.profile, component: ProfilePage, layout: null },
];
