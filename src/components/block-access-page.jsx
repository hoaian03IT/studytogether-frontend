import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { Navigate } from "react-router-dom";
import { pathname } from "../routes";

const BlockAccessPage = ({ children }) => {
	const user = useRecoilValue(userState);

	return user?.isLogged ? <Navigate to={pathname.notFound} /> : children;
};

export default BlockAccessPage;
