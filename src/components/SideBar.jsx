import {
  FaPen,
  FaBell,
  FaLock,
  FaGear,
  FaCircleQuestion,
} from "react-icons/fa6";

const sidebarList = [
  {
    icon: <FaPen />,
    label: "Hồ sơ",
  },
  {
    icon: <FaBell />,
    label: "Thông báo",
  },
  {
    icon: <FaLock />,
    label: "Bảo mật",
  },
  {
    icon: <FaGear />,
    label: "Cài đặt",
  },
  {
    icon: <FaCircleQuestion />,
    label: "Trợ giúp",
  },
];

const SideBar = () => {
  return (
    <div className="max-w-[300px] w-full flex flex-col gap-5 p-5 rounded-xl bg-white shadow-md">
      <div className="flex items-center gap-4">
        <img
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
        {sidebarList.map((item) => (
          <SidebarItem label={item.label}>{item.icon}</SidebarItem>
        ))}
      </div>
    </div>
  );
};

const SidebarItem = ({ label, children }) => {
  return (
    <div className="px-5 py-3 bg-zinc-100 rounded-xl flex gap-[18px] items-center text-zinc-800 hover:text-white hover:bg-zinc-500">
      {children}
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
};

export default SideBar;
