import { FaPen, FaBell, FaLock, FaGear, FaCircleQuestion } from "react-icons/fa6";
import { SidebarProfileItem } from "./sidebar-profile-item";

const sidebarList = [
    {
        icon: FaPen,
        label: "Hồ sơ",
        link: "/",
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
    return (
        <div className="h-full w-full flex flex-col gap-5 p-5 rounded-xl bg-white shadow-md">
            <div className="flex items-center gap-4">
                <img
                    draggable={false}
                    src="https://i.imgur.com/yXOvdOSs.jpg"
                    alt=""
                    className="w-10 h-10 rounded-full"
                />

                <div>
                    <p className="text-sm text-zinc-800 font-medium ">Phuong Thao</p>
                    <p className="text-xs text-zinc-800 ">traluongphuongthao@gmail.com</p>
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
