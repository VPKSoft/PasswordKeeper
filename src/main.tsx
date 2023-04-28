import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import StyledTitle from "./components/app/WindowTitle";

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
    <React.StrictMode>
        <StyledTitle />
        <App />
    </React.StrictMode>
);
