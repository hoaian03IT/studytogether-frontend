import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { Navigate, useLocation } from "react-router-dom";
import { pathname } from "../routes";

export const AuthedPage = ({ children }) => {
	const user = useRecoilValue(userState);
	const { pathname: pathnameRedirect, search } = useLocation();

	return user?.isLogged ? (
		children
	) : (
		<Navigate to={`${pathname.signIn}${pathnameRedirect ? `?redirect=${pathnameRedirect}${search}` : ""} `} />
	);
};
