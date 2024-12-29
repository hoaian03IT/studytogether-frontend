import { useContext, useEffect, useRef, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { pathname } from "../routes/index.js";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { Image } from "@nextui-org/image";
import { base64Converter } from "../utils/base64-convert.js";
import { TbEdit } from "react-icons/tb";
import { validationForm } from "../utils/validateForm.js";
import { useDebounce } from "../hooks/useDebounce.jsx";
import { UserService } from "../apis/user.api.js";
import { useMutation } from "@tanstack/react-query";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { toast } from "react-toastify";
import { TranslationContext } from "../providers/TranslationProvider.jsx";

const Profile = () => {
	const [user, setUser] = useRecoilState(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);

	const [editable, setEditable] = useState(false);

	const [formValue, setFormValue] = useState({
		firstName: user.info?.firstName,
		lastName: user.info?.lastName,
		phone: user.info?.phone,
		username: user.info?.username,
		avatar: user.info?.avatar,
	});

	const [validInputs, setValidInputs] = useState({
		firstName: {
			valid: true,
			errMsg: "",
		},
		lastName: {
			valid: true,
			errMsg: "",
		},
		phone: {
			valid: true,
			errMsg: "",
		},
		username: {
			valid: true,
			errMsg: "",
		},
		avatar: {
			valid: true,
			errMsg: "",
		},
	});

	useEffect(() => {
		setFormValue({
			firstName: user.info?.firstName,
			lastName: user.info?.lastName,
			phone: user.info?.phone,
			username: user.info?.username,
			avatar: user.info?.avatar,
		});
	}, [user]);

	const debouncedUsername = useDebounce(formValue.username, 1000);

	useEffect(() => {
		if (debouncedUsername !== user.info?.username)
			UserService.checkUsernameExists(debouncedUsername)
				.then(() => {
					setValidInputs((prev) => ({ ...prev, username: { valid: true, errMsg: "" } }));
				})
				.catch(() => {
					setValidInputs((prev) => ({
						...prev,
						username: { valid: false, errMsg: "Username exists" },
					}));
				});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedUsername]);

	const fileRef = useRef(null);

	const updateInfoMutation = useMutation({
		mutationFn: async (payload) => {
			return await UserService.updateUserInfo(payload, user, updateUserState);
		},
		onSuccess: (data) => {
			setUser((prev) => ({
				...prev,
				info: {
					...user.info,
					firstName: data?.["updatedInfo"]?.["first name"],
					lastName: data?.["updatedInfo"]?.["last name"],
					phone: data?.["updatedInfo"]?.["phone"],
					username: data?.["updatedInfo"]?.["username"],
					avatar: data?.["updatedInfo"]?.["avatar image"],
					googleId: data?.["updatedInfo"]?.["google id"],
					facebookId: data?.["updatedInfo"]?.["facebook id"],
				},
			}));
			setEditable(false);
			toast.success(translation(data?.["messageCode"]));
		},
		onError: (error) => {
			console.error(error);
			toast.error(error.response.data?.["errorCode"]);
		},
	});

	const handleEdit = () => {
		setEditable(true);
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;

		setFormValue({
			...formValue,
			[name]: value.trim(),
		});
	};

	const handleOpenFileSelect = (e) => {
		fileRef.current.click();
	};

	const handleUploadImage = async (e) => {
		const file = e.target.files[0];
		if (file.type.split("/")[0] !== "image") {
			toast.warn("File must be an image");
			return;
		}
		let maxSize = 2; // MB
		if (file.size / (1024 * 1024) <= maxSize) {
			toast.warn("Image must be smaller than 2MB");
			return;
		}

		const { base64 } = await base64Converter(file);
		setFormValue((prev) => ({ ...prev, avatar: base64 }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!editable) return;
		let submittable = true;
		if (formValue.lastName && !validationForm.name(formValue.lastName)) {
			submittable = false;
			setValidInputs((prev) => ({ ...prev, lastName: { valid: false, errMsg: "First name is not valid" } }));
		} else {
			setValidInputs((prev) => ({ ...prev, lastName: { valid: true, errMsg: "" } }));
		}
		if (formValue.firstName && !validationForm.name(formValue.firstName)) {
			submittable = false;
			setValidInputs((prev) => ({ ...prev, firstName: { valid: false, errMsg: "Last name is not valid" } }));
		} else {
			setValidInputs((prev) => ({ ...prev, firstName: { valid: true, errMsg: "" } }));
		}
		if (formValue.phone && !validationForm.phone(formValue.phone)) {
			submittable = false;
			setValidInputs((prev) => ({ ...prev, phone: { valid: false, errMsg: "Phone is not valid" } }));
		} else {
			setValidInputs((prev) => ({ ...prev, phone: { valid: true, errMsg: "" } }));
		}

		if (!validationForm.username(formValue.username)) {
			submittable = false;
			setValidInputs((prev) => ({ ...prev, username: { valid: false, errMsg: "Username is not valid" } }));
		} else {
			setValidInputs((prev) => ({ ...prev, username: { valid: true, errMsg: "" } }));
		}

		if (!submittable) return;
		// nếu như thông tin không thay đổi thì không cần call apis
		if (
			formValue.firstName === user.info?.firstName &&
			formValue.lastName === user.info?.lastName &&
			formValue.phone === user.info?.phone &&
			formValue.username === user.info?.username
		) {
			setEditable(false);
			return;
		}
		updateInfoMutation.mutate({
			firstName: formValue.firstName,
			lastName: formValue.lastName,
			phone: formValue.phone,
			username: formValue.username,
			avatarBase64: formValue.avatar,
		});
	};

	const handleCancel = () => {
		setFormValue({
			firstName: user.info?.firstName,
			lastName: user.info?.lastName,
			phone: user.info?.phone,
			username: user.info?.username,
			avatar: user.info?.avatar,
		});
		setEditable(false);
	};

	return (
		<div className="bg-white p-8 rounded w-full">
			<div className="flex items-center">
				<h1 className="text-2xl font-semibold flex items-center">Edit profile </h1>
				{!editable && (
					<TbEdit
						className="size-6 ms-4 text-secondary cursor-pointer active:opacity-70 transition-all"
						onClick={handleEdit}
					/>
				)}
			</div>
			<div className="">
				Hello, &nbsp;
				{user.info?.firstName || user.info?.lastName
					? `${user.info?.firstName} ${user.info?.lastName}`
					: user.info?.username}
			</div>
			<div className="flex items-center mb-6 pt-10">
				<Image
					draggable={false}
					src={formValue.avatar}
					alt="user"
					className="size-14 rounded-full mr-4 cursor-pointer object-cover object-center"
					onClick={editable ? handleOpenFileSelect : null}
				/>
				<input
					type="file"
					ref={fileRef}
					className="hidden"
					multiple={false}
					accept="image/*"
					onChange={editable ? handleUploadImage : null}
				/>
				<div>
					<h3 className="text-lg font-medium">
						{user.info?.firstName} {user.info?.lastName}
					</h3>
					<p className="text-sm text-gray-600">{user.info?.email}</p>
				</div>
			</div>
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-x-4">
					<div className="mb-8">
						<Input
							name="lastName"
							type="text"
							label={<p className="ms-1">First name</p>}
							labelPlacement="outside"
							placeholder="Trà"
							radius="sm"
							value={formValue.lastName}
							onChange={handleInputChange}
							disabled={!editable}
							isInvalid={!validInputs.lastName.valid}
							errorMessage={validInputs.lastName.errMsg}
							size="lg"
						/>
					</div>
					<div className="mb-8">
						<Input
							name="firstName"
							type="text"
							label={<p className="ms-1">Last name</p>}
							labelPlacement="outside"
							placeholder="Thảo"
							radius="sm"
							value={formValue.firstName}
							onChange={handleInputChange}
							disabled={!editable}
							isInvalid={!validInputs.firstName.valid}
							errorMessage={validInputs.firstName.errMsg}
							size="lg"
						/>
					</div>
					<div className="mb-8">
						<Input
							name="username"
							type="text"
							label={<p className="ms-1">Username</p>}
							labelPlacement="outside"
							placeholder="traluongpthao"
							radius="sm"
							value={formValue.username}
							onChange={handleInputChange}
							disabled={!editable}
							isInvalid={!validInputs.username.valid}
							errorMessage={validInputs.username.errMsg}
							size="lg"
						/>
					</div>
					<div className="mb-8">
						<Input
							name="phone"
							type="text"
							label={<p className="ms-1">Phone</p>}
							labelPlacement="outside"
							placeholder="0854212084"
							radius="sm"
							value={formValue.phone}
							onChange={handleInputChange}
							disabled={!editable}
							isInvalid={!validInputs.phone.valid}
							errorMessage={validInputs.phone.errMsg}
							size="lg"
						/>
					</div>
					{!user?.info?.facebookId && !user?.info?.googleId ? (
						<div className="mb-6">
							<Link to={pathname.changePassword} className="text-secondary hover:underline">
								Change password
							</Link>
						</div>
					) : null}
				</div>
				{editable && (
					<div className="flex gap-x-4 justify-center">
						<Button
							type="button"
							onClick={handleCancel}
							className="bg-gray-300 text-gray-700 px-4 py-2"
							color="default"
							radius="sm"
							size="lg">
							Cancel
						</Button>
						<Button
							type="submit"
							className="px-4 py-2"
							color="secondary"
							radius="sm"
							size="lg"
							isLoading={updateInfoMutation.isPending}>
							Update
						</Button>
					</div>
				)}
			</form>
		</div>
	);
};

export default Profile;
