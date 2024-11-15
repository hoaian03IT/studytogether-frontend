import { FaBell, FaCircleQuestion, FaGear, FaLock, FaPen } from "react-icons/fa6";
import { SidebarProfileItem } from "./sidebar-profile-item";
import { pathname } from "../routes/index.js";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { Image } from "@nextui-org/image";

const sidebarList = [
	{
		icon: FaPen,
		label: "Hồ sơ",
		link: pathname.profile,
	},
	{
		icon: FaBell,
		label: "Thông báo",
		link: "/",
	},
	{
		icon: FaLock,
		label: "Bảo mật",
		link: "/",
	},
	{
		icon: FaGear,
		label: "Cài đặt",
		link: "/",
	},
	{
		icon: FaCircleQuestion,
		label: "Trợ giúp",
		link: "/",
	},
];

const SidebarProfile = () => {
	const { info: userInfo } = useRecoilValue(userState);
	return (
		<div className="h-full w-full flex flex-col gap-5 py-5 px-4 rounded-xl bg-white shadow-md">
			<div className="flex items-center gap-2">
				<Image
					draggable={false}
					src={userInfo.avatar}
					alt=""
					className="size-10 rounded-full"
				/>
				<div>
					<p className="text-sm text-zinc-800 font-medium ">{userInfo.firstName} {userInfo.lastName} - {userInfo.role}</p>
					<p className="text-xs text-zinc-800 ">{userInfo.email}</p>
				</div>
			</div>
			<hr />
			<div className="flex flex-col gap-[10px] mb-auto">
				{sidebarList.map((item, index) => {
					const Icon = item.icon;
					return (
						<SidebarProfileItem key={index} label={item.label} link={item.link}>
							<Icon />
						</SidebarProfileItem>
					);
				})}
			</div>
		</div>
	);
};

export { SidebarProfile };
