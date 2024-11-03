import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/user.atom.js";
import { UserService } from "../../apis/user.api.js";
import { queryKeys } from "../../react-query/query-keys.js";

const GlobalStateContext = createContext({
	updateUserState: () => {
	},
});

function GlobalStateProvider({ children }) {
	const [user, setUser] = useRecoilState(userState);

	const updateUserState = (userState) => {
		if (userState === null) {
			setUser({
				info: {
					phone: null,
					firstName: null,
					lastName: null,
					role: null,
					avatar: null,
					username: null,
					email: null,
				},
				token: null,
				isLogged: false,
			});

		} else {
			setUser({ ...userState });
		}
	};


	useQuery({
		queryKey: [queryKeys.userState],
		queryFn: async () => {
			try {
				if (!user.isLogged) {
					const data = await UserService.fetchUserInfo(user, updateUserState);
					if (data) {
						setUser(prev => ({
							...prev, info: {
								username: data.username,
								phone: data.phone,
								firstName: data["first name"],
								lastName: data["last name"],
								avatar: data["avatar image"],
								email: data.email,
								role: data.role,
							},
						}));
						return data;
					}
				}
				return {};
			} catch (error) {
				return Promise.reject(error);
			}
		},

	});
	return <GlobalStateContext.Provider value={{ updateUserState }}>{children}</GlobalStateContext.Provider>;
}

export { GlobalStateContext, GlobalStateProvider };