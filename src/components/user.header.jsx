import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from "@nextui-org/react";
import { loadImage } from "../utils/loadImage";
import { useContext } from "react";
import { TranslationContext } from "./providers/TranslationProvider";
import { FaArrowRightFromBracket, FaPencil } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import { IoSettingsOutline, IoLockOpenOutline } from "react-icons/io5";
import { FaRegQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { pathname } from "../routes";

function UserHeader({ userState }) {
    const { translation } = useContext(TranslationContext);
    return (
        <div>
            <Dropdown className="rounded-sm">
                <DropdownTrigger>
                    <div className="flex items-center select-none cursor-pointer">
                        <Image className="size-10 rounded-full" src={loadImage(userState.info.avatar)} alt="avatar" />
                        <span className="ml-1 text-base font-medium">
                            {userState.info.firstName ? userState.info.firstName : userState.info.username}
                        </span>
                    </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions" className="px-0">
                    <DropdownItem
                        href={pathname.profile}
                        as={Link}
                        to={pathname.profile}
                        className="rounded-sm py-3"
                        startContent={<FaPencil className="size-4" />}>
                        {translation("profile")}
                    </DropdownItem>
                    <DropdownItem
                        href="/"
                        to="/"
                        as={Link}
                        className="rounded-sm py-3"
                        startContent={<FaRegBell className="size-4" />}>
                        {translation("notification")}
                    </DropdownItem>
                    <DropdownItem
                        href="/"
                        to="/"
                        as={Link}
                        className="rounded-sm py-3"
                        startContent={<IoLockOpenOutline className="size-4" />}>
                        {translation("security")}
                    </DropdownItem>
                    <DropdownItem
                        href="/"
                        to="/"
                        as={Link}
                        className="rounded-sm py-3"
                        startContent={<IoSettingsOutline className="size-4" />}>
                        {translation("setting")}
                    </DropdownItem>
                    <DropdownItem
                        href="/"
                        to="/"
                        as={Link}
                        className="rounded-sm py-3"
                        showDivider
                        startContent={<FaRegQuestionCircle className="size-4" />}>
                        {translation("support")}
                    </DropdownItem>
                    <DropdownItem
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
