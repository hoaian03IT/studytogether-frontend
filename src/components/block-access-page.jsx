import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { useLocation, useNavigate } from "react-router-dom";
import { pathname } from "../routes";
import { useEffect } from "react";

const BlockAccessPage = ({ children }) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userState);
	const { search } = useLocation();
	const redirect = new URLSearchParams(search).get("redirect");
	useEffect(() => {
		if (user?.isLogged) {
			if (redirect) navigate(redirect);
			else navigate(pathname.notFound);
		}
	}, []);

	return children;
};

export default BlockAccessPage;
