import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { Navigate, useNavigate } from "react-router-dom";
import { pathname } from "../routes";
import { useEffect } from "react";

const BlockAccessPage = ({ children }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userState);
	useEffect(() => {
		if (user?.isLogged) {
			navigate(pathname.notFound);
		}
	}, []);

	return children;
};

export default BlockAccessPage;
