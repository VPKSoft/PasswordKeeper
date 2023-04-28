import * as React from "react";
import styled from "styled-components";
import { appWindow } from "@tauri-apps/api/window";
import classNames from "classnames";
import { styleRuleValue } from "../../utilities/DomCssUtils";
import { useLocalize } from "../../i18n";

type Props = {
    className?: string;
};

const WindowTitle = ({ className }: Props) => {
    const lu = useLocalize("ui");

    const minimizeClick = React.useCallback(() => {
        appWindow.minimize();
    }, []);

    const maximizeClick = React.useCallback(() => {
        appWindow.toggleMaximize();
    }, []);

    const closeClick = React.useCallback(() => {
        appWindow.close();
    }, []);

    return (
        <div className={classNames(WindowTitle.name, className)}>
            <div className="titlebar-icon" id="titlebar-close">
                <img src="./src/img/app-icon.svg" alt="close" width={32} height={32} />
            </div>
            <div data-tauri-drag-region className="titlebar-title">
                {"Password Keeper"}
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

const StyledTitle = styled(WindowTitle)`
    height: 32px;
    background: ${styleRuleValue(".dx-theme-accent-as-text-color", "color", "#329ea3")};
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
        background: ${styleRuleValue(".dx-theme-border-color-as-text-color", "color", "#5bbec3")};
    }
    .titlebar-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
    }
    .titlebar-button:hover {
        background: ${styleRuleValue(".dx-theme-border-color-as-text-color", "color", "#5bbec3")};
    }
`;

export default StyledTitle;
