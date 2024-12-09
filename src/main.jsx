import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import "./config/i18next.js";
import { TranslationProvider } from "./providers/TranslationProvider.jsx";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GlobalStateProvider } from "./providers/GlobalStateProvider.jsx";
import { StrictMode } from "react";
import { SocketClientProvider } from "./providers/socket-client-provider.jsx";
import "./config/fb.js";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<NextUIProvider>
				<QueryClientProvider client={queryClient}>
					<GoogleOAuthProvider clientId={import.meta.env.VITE_GG_CLIENT_ID}>
						<RecoilRoot>
							<GlobalStateProvider>
								<SocketClientProvider>
									<TranslationProvider>
										<ReactQueryDevtools initialIsOpen={false} />
										<App />
									</TranslationProvider>
								</SocketClientProvider>
							</GlobalStateProvider>
						</RecoilRoot>
					</GoogleOAuthProvider>
				</QueryClientProvider>
			</NextUIProvider>
		</BrowserRouter>
	</StrictMode>,
);
