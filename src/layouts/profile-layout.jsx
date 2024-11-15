import { Header } from "../components/header";
import { SidebarProfile } from "../components/sidebar-profile";
import { useContext } from "react";
import { TranslationContext } from "../components/providers/TranslationProvider.jsx";
import { IoIosWarning } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";

export default function ProfileLayout({ children }) {
	const { translation } = useContext(TranslationContext);
	const user = useRecoilValue(userState);
	return (
		<div className="w-screen">
			<Header />
			<main className="relative">
				<div className="fixed top-16 bottom-0 w-[300px]">
					<SidebarProfile />
				</div>
				<div className="w-[calc(100%-300px)] ms-auto">
					{user.info?.lastName && user.info?.firstName && user.info?.phone && user.info?.username ?
						null : <div className="py-4 bg-warning-400 flex items-center justify-center text-white">
							<IoIosWarning className="size-8 mr-2" />
							{translation("WARNING_UPDATE_PROFILE")}
						</div>}
					<div className="container">{children}</div>
				</div>
			</main>
		</div>
	);
}
