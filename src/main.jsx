import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import "./config/i18next.js";
import { TranslationProvider } from "./components/providers/TranslationProvider.jsx";

axios.defaults.baseURL = "http://localhost:3000";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <NextUIProvider>
                <TranslationProvider>
                    <App />
                </TranslationProvider>
            </NextUIProvider>
        </BrowserRouter>
    </StrictMode>
);
