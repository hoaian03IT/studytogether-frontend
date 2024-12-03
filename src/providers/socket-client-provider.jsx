import { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const host = "http://localhost:3000";

const SocketClientContext = createContext({ socketIo: null });

function SocketClientProvider({ children }) {

	const socketRef = useRef(true);

	useEffect(() => {
		if (socketRef) {
			socketRef.current = io(host);
		}
	}, []);

	return <SocketClientContext.Provider
		value={{ socketIo: socketRef.current }}>{children}</SocketClientContext.Provider>;
}

export { SocketClientProvider, SocketClientContext };