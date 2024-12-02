import { HiOutlineViewList } from "react-icons/hi";
import { AiOutlineFire } from "react-icons/ai";
import { MdOutlineCollectionsBookmark, MdOutlineNotificationsActive, MdSearch } from "react-icons/md";
import { TbCards } from "react-icons/tb";
import { LuGamepad2 } from "react-icons/lu";
import clsx from "clsx";
import { useContext, useState } from "react";
import { SidebarMainItem } from "./sidebar-main-item";
import { TranslationContext } from "../providers/TranslationProvider";
import { NotificationComponent } from "../screen/notification-component";

function SidebarMain() {
	const { translation } = useContext(TranslationContext);

	const [streak, setStreak] = useState(0);
	const [isExpanded, setIsExpanded] = useState(true);

	const sidebarItems = [
		{
			label: translation("sidebar-main.courses"),
			icon: MdOutlineCollectionsBookmark,
			path: "/my-course",
		},
		{
			label: translation("sidebar-main.flash-card"),
			icon: TbCards,
			path: "/flashcards",
		},
		{
			label: translation("sidebar-main.game"),
			icon: LuGamepad2,
			path: "/games",
		},
		{
			label: translation("sidebar-main.notification"),
			icon: MdOutlineNotificationsActive,
			path: "/notifications",
		},
		{
			label: translation("sidebar-main.search"),
			icon: MdSearch,
			path: "/",
		},
	];

	const handleToggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div className="px-2 py-2 h-full bg-white shadow-small">
			<div
				className={clsx(
					"py-2 px-3 flex items-center justify-between border-b-stone-200 border-b-1 transition-all",
					isExpanded ? "" : "",
				)}>
				<div className="">
					<button
						className={clsx(
							"",
							isExpanded
								? "animate-[spin-half_0.2s_ease-in-out_1]"
								: "",
						)}
						onClick={handleToggleExpanded}>
						<HiOutlineViewList className="size-8" />
					</button>
				</div>
				<div
					className={clsx(
						"flex items-end",
						streak === 0 ? "text-stone-400" : "text-red-400",
					)}>
					<AiOutlineFire
						className={clsx(
							"transition-all",
							isExpanded ? "size-8" : "size-0",
						)}
					/>
					<strong className="ms-1 text-2xl">
						{isExpanded && streak}
					</strong>
				</div>
			</div>
			<div className="py-2 space-y-2">
				{sidebarItems.map((item, index) => (
					<SidebarMainItem
						icon={item.icon}
						label={item.label}
						path={item.path}
						key={index}
						isExpanded={isExpanded}
						isTrigger={
							item.label ===
							translation("sidebar-main.notification")
						}
						ModelElement={<NotificationComponent />}
					/>
				))}
			</div>
		</div>
	);
}

export { SidebarMain };
