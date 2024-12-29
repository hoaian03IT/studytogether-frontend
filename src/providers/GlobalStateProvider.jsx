import { createContext, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { UserService } from "../apis/user.api.js";
import { queryKeys } from "../react-query/query-keys.js";
import { AuthService } from "../apis/auth.api.js";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { pathname } from "../routes/index.js";
import { streakState } from "../recoil/atoms/streak.atom.js";

const GlobalStateContext = createContext({
	updateUserState: () => {},
});

function GlobalStateProvider({ children }) {
	const [user, setUser] = useRecoilState(userState);
	const [streak, setStreak] = useRecoilState(streakState);
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	const navigate = useNavigate();

	const updateUserState = (userState) => {
		if (userState === null) {
			localStorage.setItem("isLogged", JSON.stringify(false));

			setUser({
				info: {
					phone: null,
					firstName: null,
					lastName: null,
					role: null,
					avatar: null,
					username: null,
					email: null,
					facebookId: null,
					googleId: null,
				},
				token: null,
				// isLogged: false,
			});
		} else {
			setUser({ ...userState });
		}
	};

	const logoutMutation = useMutation({
		mutationFn: async () => {
			// logout & reset user state
			updateUserState(null);
			await AuthService.logout(user, updateUserState);
		},
		onSuccess: () => {
			setShowLogoutModal(false);
			toast.success("See you again!");
			navigate(pathname.home); // redirect to home page after logout
		},
		onError: (error) => {
			console.error(error);
			setShowLogoutModal(false);
			toast.error("Oops! Something went wrong!");
		},
	});

	const handleShowLogoutModal = () => {
		setShowLogoutModal(true);
	};

	const handleLogout = () => {
		if (user?.isLogged) {
			logoutMutation.mutate();
		} else {
			toast.warn("Bạn chưa đăng nhập trước đó");
		}
	};

	// query user information
	useQuery({
		queryKey: [queryKeys.userState],
		queryFn: async () => {
			try {
				if (user?.isLogged) {
					const data = await UserService.fetchUserInfo(user, updateUserState);
					setUser((prev) => ({
						...prev,
						info: {
							username: data?.username,
							phone: data?.phone,
							firstName: data?.["first name"],
							lastName: data?.["last name"],
							avatar: data?.["avatar image"],
							email: data?.email,
							role: data?.["role name"],
							facebookId: data?.["facebook id"],
							googleId: data?.["google id"],
						},
					}));

					return data;
				}
				return {};
			} catch (error) {
				return Promise.reject(error);
			}
		},
		enabled: user?.isLogged,
		staleTime: 1000 * 60 * 5, // 5 minutes
		cacheTime: 1000 * 60 * 10, // 10 minutes
	});

	// query user streak
	useQuery({
		queryKey: [queryKeys.userStreak],
		queryFn: async () => {
			const { streakInfo } = await UserService.fetchUserStreak(user, updateUserState);
			setStreak({
				currentStreak: streakInfo?.["current streak"] || 0,
				maxStreak: streakInfo?.["max streak"] || 0,
				lastCompletedDate: streakInfo?.["last completed date"],
			});
			return streakInfo;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
		enabled: !!user.token, // only fetch when user has authenticated
	});

	return (
		<GlobalStateContext.Provider value={{ updateUserState, handleShowLogoutModal }}>
			{children}
			<Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Logout</ModalHeader>
							<ModalBody>Are you sure you want to logout?</ModalBody>
							<ModalFooter>
								<Button color="default" onClick={onClose} radius="sm">
									Cancel
								</Button>
								<Button color="secondary" radius="sm" onClick={handleLogout}>
									Logout
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</GlobalStateContext.Provider>
	);
}

export { GlobalStateContext, GlobalStateProvider };
