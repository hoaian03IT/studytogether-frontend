import { useContext, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { validationForm } from "../utils/validateForm.js";
import { useMutation } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../components/providers/GlobalStateProvider.jsx";
import { AuthService } from "../apis/auth.api.js";
import { TranslationContext } from "../components/providers/TranslationProvider.jsx";
import { toast } from "react-toastify";
import { pathname } from "../routes/index.js";
import { IoChevronBack } from "react-icons/io5";

const ChangePasswordPage = () => {
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);

	const [formValue, setFormValue] = useState({
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
	});
	const [showPasswords, setShowPasswords] = useState({
		currentPassword: false,
		newPassword: false,
		confirmNewPassword: false,
	});

	const [isValidPasswords, setIsValidPasswords] = useState({
		currentPassword: { valid: true, errMsg: "" },
		newPassword: { valid: true, errMsg: "" },
		confirmNewPassword: { valid: true, errMsg: "" },
	});

	const changePasswordMutation = useMutation({
		mutationFn: async (payload) => {
			return await AuthService.changePassword({
				newPassword: payload.newPassword,
				currentPassword: payload.currentPassword,
			}, user, updateUserState);
		},
		onSuccess: (data) => {
			toast.success(translation(data?.messageCode));
			navigate(pathname.home);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	const navigate = useNavigate();

	const onChangeFormValue = (e) => {
		let { name, value } = e.target;

		setFormValue({
			...formValue,
			[name]: value,
		});
	};

	const handleTogglePasswordVisibility = (name) => {
		setShowPasswords({ ...showPasswords, [name]: !showPasswords[name] });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let submittable = true;
		if (!validationForm.password(formValue.currentPassword)) {
			setIsValidPasswords(prev => ({
				...prev,
				currentPassword: {
					valid: false,
					errMsg: "Invalid password (include upper, lower, number and specials, at least 8 characters)",
				},
			}));
			submittable = false;
		} else {
			setIsValidPasswords(prev => ({
				...prev,
				currentPassword: {
					valid: true,
					errMsg: "",
				},
			}));
		}
		if (!validationForm.password(formValue.newPassword)) {
			setIsValidPasswords(prev => ({
				...prev,
				newPassword: {
					valid: false,
					errMsg: "Invalid password (include upper, lower, number and specials, at least 8 characters)",
				},
			}));
			submittable = false;
		} else {
			setIsValidPasswords(prev => ({
				...prev,
				newPassword: {
					valid: true,
					errMsg: "",
				},
			}));
		}
		if (formValue.newPassword !== formValue.confirmNewPassword) {
			setIsValidPasswords(prev => ({
				...prev,
				confirmNewPassword: {
					valid: false,
					errMsg: "Not match",
				},
			}));
			submittable = false;
		} else {
			setIsValidPasswords(prev => ({
				...prev,
				confirmNewPassword: {
					valid: true,
					errMsg: "",
				},
			}));
		}

		if (!submittable)
			return;

		changePasswordMutation.mutate({
			newPassword: formValue.newPassword,
			currentPassword: formValue.currentPassword,
		});
	};

	return (
		<div className="flex justify-center items-center mt-20">
			<form onSubmit={handleSubmit} className="w-[400px] bg-white p-8 shadow-small rounded-md relative">
				<Button color="default" radius="full" variant="default" isIconOnly={true} size="sm"
						onClick={() => navigate(-1)}
						className="absolute top-2 left-2 text-secondary"><IoChevronBack
					className="size-6" /></Button>
				<h2 className="text-2xl font-bold mb-2 text-center">Đặt lại mật khẩu</h2>
				<p className="text-gray-500 text-center mb-14 text-small">Nhập mật khẩu mới của bạn.</p>

				<div className="relative mb-10">
					<Input
						name="currentPassword"
						type={showPasswords.currentPassword ? "text" : "password"}
						placeholder="Mật khẩu hiện tại"
						value={formValue.currentPassword}
						onChange={onChangeFormValue}
						className="w-full"
						radius="sm"
						size="lg"
						labelPlacement="outside"
						label={<span className="text-sm mt-5">Mật khẩu mới</span>}
						required
						isRequired
						isInvalid={!isValidPasswords.currentPassword.valid}
						errorMessage={isValidPasswords.currentPassword.errMsg}
						endContent={<span
							aria-label="currentPassword"
							aria-description="currentPassword"
							onClick={() => handleTogglePasswordVisibility("currentPassword")}
							className="cursor-pointer">
                            {showPasswords.currentPassword ? <BsEyeFill className="size-5" /> :
								<BsEyeSlashFill className="size-5" />}
                            </span>}
					/>

				</div>

				{/*  mật khẩu mới */}
				<div className="relative mb-10">
					<Input
						name="newPassword"
						type={showPasswords.newPassword ? "text" : "password"}
						placeholder="Mật khẩu mới"
						value={formValue.newPassword}
						onChange={onChangeFormValue}
						className="w-full"
						radius="sm"
						size="lg"
						labelPlacement="outside"
						label={<span className="text-sm mt-5">Mật khẩu mới</span>}
						required
						isRequired
						isInvalid={!isValidPasswords.newPassword.valid}
						errorMessage={isValidPasswords.newPassword.errMsg}
						endContent={<span
							onClick={() => handleTogglePasswordVisibility("newPassword")}
							className="cursor-pointer">
                            {showPasswords.newPassword ? <BsEyeFill className="size-5" /> :
								<BsEyeSlashFill className="size-5" />}
                    </span>}
					/>


				</div>

				{/* Xác nhận mật khẩu */}
				<div className="relative mb-6">
					<Input
						name="confirmNewPassword"
						type={showPasswords.confirmNewPassword ? "text" : "password"}
						placeholder="Xác nhận mật khẩu"
						value={formValue.confirmNewPassword}
						onChange={onChangeFormValue}
						className="w-full"
						radius="sm"
						size="lg"
						labelPlacement="outside"
						label={<span className="text-sm mt-4">Xác nhận mật khẩu</span>}
						required
						isRequired
						isInvalid={!isValidPasswords.confirmNewPassword.valid}
						errorMessage={isValidPasswords.confirmNewPassword.errMsg}
						endContent={<span
							onClick={() => handleTogglePasswordVisibility("confirmNewPassword")}
							className="cursor-pointer">
                        {showPasswords.confirmNewPassword ? <BsEyeFill className="size-5" /> :
							<BsEyeSlashFill className="size-5" />}
                    </span>}
					/>
				</div>

				{/* reset mk*/}
				<Button type="submit" size="lg" className="w-full bg-secondary text-white" radius="sm">
					Đặt lại mật khẩu
				</Button>
			</form>
		</div>
	);
};

export default ChangePasswordPage;
