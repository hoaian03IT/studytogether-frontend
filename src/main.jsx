import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <NextUIProvider>
                <App />
            </NextUIProvider>
        </BrowserRouter>
    </StrictMode>
);
