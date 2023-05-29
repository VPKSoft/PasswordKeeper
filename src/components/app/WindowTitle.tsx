import * as React from "react";
import styled from "styled-components";
import { appWindow } from "@tauri-apps/api/window";
import classNames from "classnames";
import { useLocalize } from "../../i18n";
import { Settings } from "../../types/Settings";

type Props = {
    className?: string;
    title: string | (() => string);
    onClose?: () => Promise<boolean> | boolean;
    onUserInteraction?: () => void;
};

const WindowTitle = ({
    className, //
    title,
    onClose,
    onUserInteraction,
}: Props) => {
    const lu = useLocalize("ui");

    const minimizeClick = React.useCallback(() => {
        appWindow.minimize();
    }, []);

    const maximizeClick = React.useCallback(() => {
        appWindow.toggleMaximize();
    }, []);

    const closeClick = React.useCallback(() => {
        if (onClose) {
            Promise.resolve(onClose()).then(result => {
                if (!result) {
                    appWindow.close();
                }
            });
        }
    }, [onClose]);

    const displayTitle = React.useMemo(() => {
        return typeof title === "string" ? title : title();
    }, [title]);

    return (
        <div //
            className={classNames(WindowTitle.name, className)}
            onMouseDown={onUserInteraction}
            onMouseUp={onUserInteraction}
            onMouseMove={onUserInteraction}
            onKeyDown={onUserInteraction}
            onKeyUp={onUserInteraction}
        >
            <div className="titlebar-icon" id="titlebar-close">
                <img src="./src/img/app-icon.svg" alt="close" width={32} height={32} />
            </div>
            <div data-tauri-drag-region className="titlebar-title">
                {displayTitle}
            </div>
            <div className="titlebar-buttonContainer">
                <div className="titlebar-button" id="titlebar-minimize" onClick={minimizeClick} title={lu("minimize", "Minimize")}>
                    <img src="./src/img/mdi_window-minimize.svg" alt="minimize" />
                </div>
                <div className="titlebar-button" id="titlebar-maximize" onClick={maximizeClick} title={lu("maximize", "Maximize")}>
                    <img src="./src/img/mdi_window-maximize.svg" alt="maximize" />
                </div>
                <div className="titlebar-button" id="titlebar-close" onClick={closeClick} title={lu("close", "Close")}>
                    <img src="./src/img/mdi_close.svg" alt="close" />
                </div>
            </div>
        </div>
    );
};

// A dirty and easy solution for the title colors "fitting" the selected theme.
const titleColor = (type: "background" | "foreground", fallback: string) => {
    if (window) {
        const value = window.localStorage.getItem("settings");
        if (value === null) {
            return fallback;
        }
        const settings = JSON.parse(value) as Settings;

        switch (settings.dx_theme) {
            case "generic.carmine":
            case "generic.carmine.compact": {
                return type === "foreground" ? "#f05b41" : "#dee1e3";
            }
            case "generic.contrast":
            case "generic.contrast.compact": {
                return type === "foreground" ? "#cf00d7" : "#fff";
            }
            case "generic.dark":
            case "generic.dark.compact": {
                return type === "foreground" ? "#1ca8dd" : "#4d4d4d";
            }
            case "generic.darkmoon":
            case "generic.darkmoon.compact": {
                return type === "foreground" ? "#1ca8dd" : "#4d4d4d";
            }
            case "generic.darkviolet":
            case "generic.darkviolet.compact": {
                return type === "foreground" ? "#9c63ff" : "#343840";
            }
            case "generic.greenmist":
            case "generic.greenmist.compact": {
                return type === "foreground" ? "#3cbab2" : "#dedede";
            }
            case "generic.light":
            case "generic.light.compact": {
                return type === "foreground" ? "#337ab7" : "#ddd";
            }
            case "material.blue.dark":
            case "material.blue.dark.compact": {
                return type === "foreground" ? "#03a9f4" : "#515159";
            }
            case "material.blue.light":
            case "material.blue.light.compact": {
                return type === "foreground" ? "#03a9f4" : "#e0e0e0";
            }
            case "material.lime.dark":
            case "material.lime.dark.compact": {
                return type === "foreground" ? "#cddc39" : "#515159";
            }
            case "material.orange.dark":
            case "material.orange.dark.compact": {
                return type === "foreground" ? "#ff5722" : "#515159";
            }
            case "material.orange.light":
            case "material.orange.light.compact": {
                return type === "foreground" ? "#ff5722" : "#e0e0e0";
            }
            case "material.purple.dark":
            case "material.purple.dark.compact": {
                return type === "foreground" ? "#9c27b0" : "#515159";
            }
            case "material.purple.light":
            case "material.purple.light.compact": {
                return type === "foreground" ? "#9c27b0" : "#e0e0e0";
            }
            case "material.teal.dark":
            case "material.teal.dark.compact": {
                return type === "foreground" ? "#009688" : "#515159";
            }
            case "generic.softblue":
            case "generic.softblue.compact": {
                return type === "foreground" ? "#7ab8eb" : "#e8eaeb";
            }
            case "material.lime.light":
            case "material.lime.light.compact": {
                return type === "foreground" ? "#cddc39" : "#e0e0e0";
            }
            case "material.teal.light":
            case "material.teal.light.compact": {
                return type === "foreground" ? "#009688" : "#e0e0e0";
            }
        }
    }

    return fallback;
};

const StyledTitle = styled(WindowTitle)`
    height: 32px;
    background: ${titleColor("foreground", "#329ea3")};
    user-select: none;
    display: flex;
    flex-direction: row;
    top: 0;
    left: 0;
    right: 0;
    position: fixed;
    .titlebar-title {
        text-align: left;
        margin: auto;
        padding-left: 10px;
        width: 100%;
        font-weight: bolder;
    }
    .titlebar-buttonContainer {
        display: flex;
        justify-content: flex-end;
    }
    .titlebar-icon {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        background: ${titleColor("background", "#5bbec3")};
    }
    .titlebar-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
    }
    .titlebar-button:hover {
        background: ${titleColor("background", "#5bbec3")};
    }
`;

export default StyledTitle;
