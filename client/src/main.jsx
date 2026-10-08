import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PetCareProvider } from "./context/PetCareContext.jsx";
import "./styles/style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <PetCareProvider>
            <App />
        </PetCareProvider>
    </React.StrictMode>
);