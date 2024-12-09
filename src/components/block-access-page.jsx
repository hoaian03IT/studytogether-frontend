import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import NotFound from "../screen/not-found";

const BlockAccessPage = ({ children }) => {
	const user = useRecoilValue(userState);
	useEffect(() => {
		console.log(user?.isLogged);
	}, []);
	return user?.isLogged ? <NotFound /> : children;
};

export default BlockAccessPage;
