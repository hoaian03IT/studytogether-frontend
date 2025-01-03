import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from "@nextui-org/react";
import { loadImage } from "../utils/loadImage";
import { useContext } from "react";
import { TranslationContext } from "../providers/TranslationProvider";
import { FaArrowRightFromBracket, FaBookOpen, FaPencil, FaRegMoneyBill1 } from "react-icons/fa6";
import { FaRegBell, FaRegQuestionCircle } from "react-icons/fa";
import { IoLockOpenOutline, IoSettingsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { pathname } from "../routes";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { PiWarningCircleFill } from "react-icons/pi";

function UserHeader({ userState }) {
	const { translation } = useContext(TranslationContext);
	const { handleShowLogoutModal } = useContext(GlobalStateContext);
	return (
		<div>
			<Dropdown className="rounded-sm">
				<DropdownTrigger>
					<div className="flex items-center select-none cursor-pointer">
						<Image className="size-10" radius="full" src={loadImage(userState.info?.avatar)} alt="avatar" />
						<span className="ml-1 text-base font-medium">
							{userState.info?.firstName && userState.info?.lastName
								? `${userState.info?.firstName} ${userState.info?.lastName}`
								: userState.info?.username}
						</span>
					</div>
				</DropdownTrigger>
				<DropdownMenu aria-label="Static Actions" className="px-0">
					<DropdownItem
						href={pathname.profile}
						as={Link}
						to={pathname.profile}
						className="rounded-sm py-3"
						startContent={<FaPencil className="size-4" />}
						endContent={
							userState.info?.lastName &&
							userState.info?.firstName &&
							userState.info?.phone &&
							userState.info?.username ? null : (
								<PiWarningCircleFill className="size-6 text-warning shadow-warning rounded-full" />
							)
						}>
						{translation("profile")}
					</DropdownItem>
					<DropdownItem
						href="/"
						to={pathname.myCourse}
						as={Link}
						className="rounded-sm py-3"
						startContent={<FaBookOpen className="size-4" />}>
						Owned courses
					</DropdownItem>
					<DropdownItem
						href="/"
						to="/"
						as={Link}
						className="rounded-sm py-3"
						startContent={<FaRegMoneyBill1 className="size-4" />}>
						Revenue
					</DropdownItem>
					<DropdownItem
						onClick={handleShowLogoutModal}
						className="rounded-sm py-3"
						color="secondary"
						startContent={<FaArrowRightFromBracket className="size-4" />}>
						{translation("sign-out")}
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	);
}

export { UserHeader };
