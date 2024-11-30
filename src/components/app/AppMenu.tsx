/*
MIT License

Copyright (c) 2024 Petteri Kautonen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { faFloppyDisk as faFloppyDiskSave } from "@fortawesome/free-regular-svg-icons";
import {
    //
    faCircleInfo,
    faCircleQuestion,
    faCircleXmark,
    faDoorOpen,
    faFile,
    faFloppyDisk,
    faFolderOpen,
    faGear,
    faPen,
    faSliders,
    faSquarePlus,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, type MenuProps } from "antd";
import classNames from "classnames";
import type { MenuInfo, MenuMode } from "rc-menu/lib/interface";
import * as React from "react";
import { styled } from "styled-components";
import { useLocalize } from "../../I18n";
import type { DataEntry } from "../../types/PasswordEntry";
import type { CommonProps } from "../Types";
import { darkModeMenuBackground, lightModeMenuBackground } from "./AntdConstants";

type ActionNames =
    | "new"
    | "open"
    | "save"
    | "saveas"
    | "exit"
    | "additem"
    | "edit"
    | "delete"
    | "settings"
    | "about"
    | "close"
    | "help"
    | "file_preferences";

const makeKey = (action: ActionNames) => {
    return `"menu":${action}`;
};

/**
 * Creates the application menu structure with localization for the menu item names.
 * @param localize The localization function.
 * @param entry The currently selected item.
 * @param isNewFile A value indicating whether the file is a new file.
 * @param isfileChanged A value indicating whether the file has been changed.
 * @returns A localized menu structure for the application.
 */
const appMenuData = (
    localize: (entryName: string, defaultValue?: string | undefined) => string,
    entry: DataEntry | undefined,
    isfileChanged: boolean
): MenuProps["items"] => {
    const result: MenuProps["items"] = [
        {
            label: localize("menuFile"),
            key: "menu:menuFile",
            children: [
                {
                    label: localize("fileNew"),
                    key: makeKey("new"),
                    icon: <FontAwesomeIcon icon={faFile} />,
                },
                {
                    key: makeKey("open"),
                    label: localize("fileOpen"),
                    icon: <FontAwesomeIcon icon={faFolderOpen} />,
                    disabled: isfileChanged,
                },
                {
                    label: localize("filePreferences"),
                    key: makeKey("file_preferences"),
                    icon: <FontAwesomeIcon icon={faSliders} />,
                },
                {
                    label: localize("fileClose"),
                    key: makeKey("close"),
                    icon: <FontAwesomeIcon icon={faCircleXmark} />,
                },
                {
                    label: localize("fileSave"),
                    key: makeKey("save"),
                    icon: <FontAwesomeIcon icon={faFloppyDiskSave} />,
                    disabled: isfileChanged !== true,
                },
                {
                    label: localize("fileSaveAs"),
                    key: makeKey("saveas"),
                    icon: <FontAwesomeIcon icon={faFloppyDisk} />,
                },
                {
                    label: localize("appExit"),
                    key: makeKey("exit"),
                    icon: <FontAwesomeIcon icon={faDoorOpen} />,
                },
            ],
        },
        {
            label: localize("menuItems"),
            key: "menu:menuEdit",
            children: [
                {
                    label: localize("itemAdd"),
                    key: makeKey("additem"),
                    icon: <FontAwesomeIcon icon={faSquarePlus} />,
                },
                {
                    label: localize("itemEdit"),
                    key: makeKey("edit"),
                    icon: <FontAwesomeIcon icon={faPen} />,
                    disabled: entry === undefined,
                },
                {
                    label: localize("itemDelete"),
                    key: makeKey("delete"),
                    icon: <FontAwesomeIcon icon={faTrashCan} />,
                    disabled: entry === undefined,
                },
            ],
        },
        {
            key: "menu:menuTools",
            label: localize("menuTools"),
            children: [
                {
                    label: localize("menuSettings"),
                    key: makeKey("settings"),
                    icon: <FontAwesomeIcon icon={faGear} />,
                },
                {
                    label: localize("help"),
                    key: makeKey("help"),
                    icon: <FontAwesomeIcon icon={faCircleQuestion} />,
                },
                {
                    label: localize("about"),
                    key: makeKey("about"),
                    icon: <FontAwesomeIcon icon={faCircleInfo} />,
                },
            ],
        },
    ];

    return result;
};

/**
 * The props for the {@link AppMenu} component.
 */
export type AppMenuProps = {
    /** The currently selected {@link DataEntry} item. */
    entry: DataEntry | undefined;
    /** A value indicating whether the current file is a new file. E.g. doesn't exist in the file system. */
    isNewFile: boolean;
    /** A value indicating whether the current file has been changed. */
    isfileChanged: boolean;
    /** The mode of the application menu. */
    mode?: MenuMode;
    /** A value indicating whether to use dark mode with the application. */
    darkMode: boolean;
    /** Occurs when a menu item was clicked. */
    onItemClick: (action: ActionNames) => void;
} & CommonProps;

/**
 * A component for the application menu for the PasswordKeeper.
 * @param param0 The component props {@link AppMenuProps}.
 * @returns A component.
 */
const AppMenu = ({
    className, //
    entry,
    isfileChanged,
    mode = "horizontal",
    onItemClick,
}: AppMenuProps) => {
    const lm = useLocalize("menu");

    // Memoize the menu to prevent re-rendering all the time.
    const menuData = React.useMemo(() => {
        return appMenuData(lm, entry, isfileChanged);
    }, [entry, isfileChanged, lm]);

    const onClick: MenuProps["onClick"] = React.useCallback(
        (e: MenuInfo) => {
            const key = e.key.split(":")[1] as ActionNames;
            onItemClick(key);
        },
        [onItemClick]
    );

    return (
        <div className={classNames(AppMenu.name, className)}>
            <Menu //
                mode={mode}
                items={menuData}
                onClick={onClick}
            />
        </div>
    );
};

const StyledAppMenu = styled(AppMenu)`
    display: flex;
    flex-direction: column;
    min-height: 0px;
    padding-bottom: 10px;
    background-color: ${props => (props.darkMode ? darkModeMenuBackground : lightModeMenuBackground)};
`;

export { StyledAppMenu };

export type { ActionNames };
