import * as React from "react";
import styled from "styled-components";
import { appWindow } from "@tauri-apps/api/window";
import classNames from "classnames";
import { useLocalize } from "../../i18n";
import { CommonProps } from "../Types";
import { AppIcon, MdiClose, MdiWindowMaximize, MdiWindowMinimize } from "../../utilities/app/Images";
import { titleColor } from "../../utilities/DxUtils";

/**
 * The props for the {@link WindowTitle} component.
 */
type WindowTitleProps = {
    /** The title text to display on the window title. */
    title: string | (() => string);
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
    onClose,
    onUserInteraction,
}: WindowTitleProps) => {
    const lu = useLocalize("ui");

    const minimizeClick = React.useCallback(() => {
        appWindow.minimize();
    }, []);

    const maximizeClick = React.useCallback(() => {
        appWindow.toggleMaximize();
    }, []);

    // Close the application if the onClose callback returned false.
    const closeClick = React.useCallback(() => {
        if (onClose) {
            Promise.resolve(onClose()).then(result => {
                if (!result) {
                    appWindow.close();
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
                <div className="titlebar-button" id="titlebar-minimize" onClick={minimizeClick} title={lu("minimize", "Minimize")}>
                    <img src={MdiWindowMinimize} alt="minimize" />
                </div>
                <div className="titlebar-button" id="titlebar-maximize" onClick={maximizeClick} title={lu("maximize", "Maximize")}>
                    <img src={MdiWindowMaximize} alt="maximize" />
                </div>
                <div className="titlebar-button" id="titlebar-close" onClick={closeClick} title={lu("close", "Close")}>
                    <img src={MdiClose} alt="close" />
                </div>
            </div>
        </div>
    );
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

export { StyledTitle };
