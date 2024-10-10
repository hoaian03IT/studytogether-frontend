import { HiOutlineViewList } from "react-icons/hi";
import { AiOutlineFire } from "react-icons/ai";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { TbCards } from "react-icons/tb";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { LuGamepad2 } from "react-icons/lu";
import { MdSearch } from "react-icons/md";
import clsx from "clsx";
import { useState } from "react";
import { SidebarMainItem } from "./sidebar-main-item";

const sidebarItems = [
    {
        label: "Các khoá học",
        icon: MdOutlineCollectionsBookmark,
        path: "/courses",
    },
    {
        label: "Flashcards",
        icon: TbCards,
        path: "/flashcards",
    },
    {
        label: "Trò chơi",
        icon: LuGamepad2,
        path: "/games",
    },
    {
        label: "Thông báo",
        icon: MdOutlineNotificationsActive,
        path: "/notifications",
    },
    {
        label: "Tìm kiếm",
        icon: MdSearch,
        path: "/",
    },
];

function SidebarMain() {
    const [streak, setStreak] = useState(0);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleToggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="px-2 py-2 h-full bg-white shadow-small rounded-md">
            <div
                className={clsx(
                    "py-4 flex items-center justify-between border-b-stone-200 border-b-1 transition-all",
                    isExpanded ? "px-4" : "px-2"
                )}>
                <div>
                    <button
                        className={clsx("p-0.5", isExpanded ? "animate-[spin-half_0.2s_ease-in-out_1]" : "")}
                        onClick={handleToggleExpanded}>
                        <HiOutlineViewList className="size-8" />
                    </button>
                </div>
                <div className={clsx("flex items-end", streak === 0 ? "text-stone-400" : "text-red-400")}>
                    <AiOutlineFire className={clsx("transition-all", isExpanded ? "size-8" : "size-0")} />
                    <strong className="ms-1 text-2xl">{isExpanded && streak}</strong>
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
                    />
                ))}
            </div>
        </div>
    );
}

export { SidebarMain };
