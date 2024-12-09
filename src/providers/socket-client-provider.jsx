import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { NotificationService } from "../apis/notification.api.js";
import { GlobalStateContext } from "./GlobalStateProvider.jsx";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const host = "http://localhost:3000";

const SocketClientContext = createContext();

class SocketHandlerClass {
	constructor(socket) {
		this.socket = socket;
	}

	handleEmitEnrollCourse(enrollmentId) {
		this.socket.emit("course-enrollment", { enrollmentId });
	}
}

function SocketClientProvider({ children }) {
	const socketRef = useRef();
	const [connected, setConnected] = useState(false);
	const [SocketHandler, setSocketHandler] = useState(null);
	const [notifications, setNotifications] = useState([]);
	const { updateUserState } = useContext(GlobalStateContext);

	const user = useRecoilValue(userState);

	const getNotificationsMutation = useMutation({
		mutationFn: async () => {
			return await NotificationService.getAllNotifications(user, updateUserState);
		},
		onSuccess: (data) => {
			setNotifications(data?.notifications);
		},
		onError: (error) => {
			console.log(error);
		},
	});

	const getNewNotificationMutation = useMutation({
		mutationFn: async (notificationId) => {
			return await NotificationService.getNotification(notificationId, user, updateUserState);
		},
		onSuccess: (data) => {
			setNotifications((prev) => [...prev, data]);
			toast.info(`${data?.factor} ${data?.message} ${data?.target}`, {
				position: "top-left",
				style: {
					fontSize: "12px",
				},
			});
		},
		onError: (error) => {
			console.log(error);
		},
	});

	useEffect(() => {
		if (user?.isLogged && user?.token) {
			getNotificationsMutation.mutate();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.isLogged, user?.token]);

	useEffect(() => {
		socketRef.current = io(host);
		if (user?.info?.username) {
			socketRef.current.emit("register", { username: user?.info?.username });
			setConnected(true);
			setSocketHandler(new SocketHandlerClass(socketRef.current));
		}

		if (socketRef.current && user?.isLogged) {
			socketRef.current.on("receive-notification", async (notificationId) => {
				getNewNotificationMutation.mutate(notificationId);
			});
		}

		return () => {
			socketRef.current.disconnect();
		};
	}, [user?.info?.username, user?.isLogged]);

	return (
		<SocketClientContext.Provider
			value={{
				notifications,
				socket: socketRef.current,
				connected,
				SocketHandler: SocketHandler,
			}}>
			{children}
		</SocketClientContext.Provider>
	);
}

export { SocketClientProvider, SocketClientContext };
