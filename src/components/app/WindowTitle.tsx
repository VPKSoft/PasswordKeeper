import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import classNames from "classnames";
import * as React from "react";
import { styled } from "styled-components";
import { useLocalize } from "../../I18n";
import { AppIcon, MdiClose, MdiWindowMaximize, MdiWindowMinimize } from "../../utilities/app/Images";
import type { CommonProps } from "../Types";
const appWindow = getCurrentWebviewWindow();

type TitleColorConfig = {
    titleBackground: string;
    textColor: string;
    closeButtonColor: string;
    minimizeButtonColor: string;
    maximizeButtonColor: string;
    iconBackground: string;
    buttonHoverBackground: string;
};

/**
 * The props for the {@link WindowTitle} component.
 */
type WindowTitleProps = {
    /** The title text to display on the window title. */
    title: string | (() => string);
    /** A value indicating whether to use dark mode. */
    darkMode?: boolean;
    /** The color configuration for dark mode. */
    colorConfigDark?: TitleColorConfig;
    /** The color configuration for light mode. */
    colorConfigLight?: TitleColorConfig;
    /** Occurs when the close button of the title bar was clicked. */
    onClose?: () => Promise<boolean> | boolean;
    /**
     * Occurs when user interaction occurs within the component. E.g. the mouse is moved.
     * This is for tracking the application idle status.
     */
    onUserInteraction?: () => void;
} & CommonProps;

/**
 * A custom window title component for the a Tauri application.
 * NOTE: This is depended of the types and libraries used by this software.
 * @param param0 The component props: {@link WindowTitleProps}.
 * @returns A component.
 */
const WindowTitle = ({
    className, //
    title,
    darkMode,
    colorConfigDark = titleColorConfigDark,
    colorConfigLight = titleColorConfigLight,
    onClose,
    onUserInteraction,
}: WindowTitleProps) => {
    const lu = useLocalize("ui");

    const minimizeClick = React.useCallback(() => {
        void appWindow.minimize();
    }, []);

    const maximizeClick = React.useCallback(() => {
        void appWindow.toggleMaximize();
    }, []);

    // Close the application if the onClose callback returned false.
    const closeClick = React.useCallback(() => {
        if (onClose) {
            void Promise.resolve(onClose()).then(result => {
                if (!result) {
                    void appWindow.close();
                }
            });
        }
    }, [onClose]);

    // Memoize the display title.
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
                <img src={AppIcon} alt="app icon" width={32} height={32} />
            </div>
            <div data-tauri-drag-region className="titlebar-title">
                {displayTitle}
            </div>
            <div className="titlebar-buttonContainer">
                <div
                    className="titlebar-button"
                    id="titlebar-minimize"
                    onClick={minimizeClick}
                    title={lu("minimize", "Minimize")}
                >
                    {windowMinimize(
                        darkMode ? colorConfigDark.minimizeButtonColor : colorConfigLight.minimizeButtonColor
                    )}
                </div>
                <div
                    className="titlebar-button"
                    id="titlebar-maximize"
                    onClick={maximizeClick}
                    title={lu("maximize", "Maximize")}
                >
                    {windowMaximize(
                        darkMode ? colorConfigDark.maximizeButtonColor : colorConfigLight.maximizeButtonColor
                    )}
                </div>
                <div className="titlebar-button" id="titlebar-close" onClick={closeClick} title={lu("close", "Close")}>
                    {window_close(darkMode ? colorConfigDark.closeButtonColor : colorConfigLight.closeButtonColor)}
                </div>
            </div>
        </div>
    );
};

const titleColorConfigDark: TitleColorConfig = {
    titleBackground: "black",
    textColor: "white",
    closeButtonColor: "white",
    minimizeButtonColor: "white",
    maximizeButtonColor: "white",
    iconBackground: "black",
    buttonHoverBackground: "#02133a",
};

const titleColorConfigLight: TitleColorConfig = {
    titleBackground: "rgb(230, 244, 255)",
    textColor: "#00a3ff",
    closeButtonColor: "#00a3ff",
    minimizeButtonColor: "#00a3ff",
    maximizeButtonColor: "#00a3ff",
    iconBackground: "white",
    buttonHoverBackground: "#cbe9fa",
};

const window_close = (fill: string, stroke?: string) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path //
                fill={fill}
                stroke={stroke ?? fill}
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
            />
        </svg>
    );
};

const windowMaximize = (fill: string, stroke?: string) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path //
                fill={fill}
                stroke={stroke ?? fill}
                d="M4 4h16v16H4V4m2 4v10h12V8H6Z"
            />
        </svg>
    );
};

const windowMinimize = (fill: string, stroke?: string) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path //
                fill={fill}
                stroke={stroke ?? fill}
                d="M20 14H4v-4h16"
            />
        </svg>
    );
};

const StyledTitle = styled(WindowTitle)`
    height: 32px;
    background: ${p => (p.darkMode ? (p.colorConfigDark ?? titleColorConfigDark)?.titleBackground : (p.colorConfigLight ?? titleColorConfigLight)?.titleBackground)};
    color: ${p => (p.darkMode ? (p.colorConfigDark ?? titleColorConfigDark)?.textColor : (p.colorConfigLight ?? titleColorConfigLight)?.textColor)};
    user-select: none;
    display: flex;
    flex-direction: row;
    margin-left: 1px;
    margin-top: 1px;
    margin-right: 1px;
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
        background: ${p => (p.darkMode ? (p.colorConfigDark ?? titleColorConfigDark)?.iconBackground : (p.colorConfigLight ?? titleColorConfigLight)?.iconBackground)};
    }
    .titlebar-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
    }
    .titlebar-button:hover {
        background: ${p => (p.darkMode ? (p.colorConfigDark ?? titleColorConfigDark)?.buttonHoverBackground : (p.colorConfigLight ?? titleColorConfigLight)?.buttonHoverBackground)};
    }
`;

export { StyledTitle, titleColorConfigDark, titleColorConfigLight };
