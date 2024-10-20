import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import "./config/i18next.js";
import { TranslationProvider } from "./components/providers/TranslationProvider.jsx";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <NextUIProvider>
                <QueryClientProvider client={queryClient}>
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GG_CLIENT_ID}>
                        <RecoilRoot>
                            <TranslationProvider>
                                <ReactQueryDevtools initialIsOpen={false} />
                                <App />
                            </TranslationProvider>
                        </RecoilRoot>
                    </GoogleOAuthProvider>
                </QueryClientProvider>
            </NextUIProvider>
        </BrowserRouter>
    </StrictMode>
);
