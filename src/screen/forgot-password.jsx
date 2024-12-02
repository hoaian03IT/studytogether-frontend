import { useContext, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../apis/auth.api.js";
import { pathname } from "../routes/index.js";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { validationForm } from "../utils/validateForm.js";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [validInput, setValidInput] = useState({
		valid: true,
		errMsg: "",
	});

	const { translation } = useContext(TranslationContext);

	const onChangeEmail = (event) => {
		let value = event.target.value;
		setEmail(value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!validationForm.email(email)) {
			setValidInput({ valid: false, errMsg: "Invalid email" });
			return;
		} else {
			setValidInput({ valid: true, errMsg: "" });
		}
		setLoading(true);
		try {
			if (email) {
				await AuthService.forgotPassword(email);
				// xử lý sau khi call thành công
				toast.success("Please check new password in your email");
				navigate(pathname.changePasswordSuccessfully);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(translation(error.response.data?.["errorCode"]));
			}
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center mt-20">
			<div className="w-[400px] bg-white p-8 shadow-small rounded-md">
				<h2 className="text-2xl font-bold mb-2 text-center">Bạn quên mật khẩu?</h2>
				<p className="text-gray-500 text-center mb-14 text-small">
					Đừng lo lắng. Chúng tôi sẽ giúp bạn <br /> Trước tiên hãy nhập email của bạn
				</p>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<Input
							type="text"
							placeholder="user@example.com"
							value={email}
							onChange={onChangeEmail}
							className="w-full"
							size="lg"
							labelPlacement="outside"
							radius="sm"
							label={<span className="text-sm text-gray-600 select-none">Email</span>}
							isInvalid={!validInput.valid}
							errorMessage={validInput.errMsg}
							required
							isRequired />
					</div>

					<Button type="submit" size="lg" radius="sm" className="w-full bg-secondary text-white mt-4"
							isLoading={loading}>
						Tiếp tục
					</Button>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
