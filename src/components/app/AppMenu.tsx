/*
MIT License

Copyright (c) 2023 Petteri Kautonen

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

import * as React from "react";
import Menu from "devextreme-react/menu";
import classNames from "classnames";
import { styled } from "styled-components";
import { ItemClickEvent } from "devextreme/ui/menu";
import { useLocalize } from "../../i18n";
import { DataEntry } from "../../types/PasswordEntry";
import { CommonProps } from "../Types";

const ActionValues = ["new", "open", "save", "saveas", "exit", "additem", "addcategory", "edit", "delete", "settings", "about", "close", "help", "file_preferences"] as const;
type ActionNames = (typeof ActionValues)[number];

/**
 * A type for menu items used by the {@link AppMenu} component.
 */
type MenuData = {
    /** A pseudo-identifier for the menu item. */
    id: string;
    /** A display name for the menu item. */
    name: string;
    /** An action name the menu item is going to be performing upon click. */
    actionName?: ActionNames;
    /** Optional submenu items for the current item. */
    items?: MenuData[];
    /** Optional icon for the menu item. */
    icon?: string;
    /** A value indicating whether a menu group separator should be placed before this menu item. */
    beginGroup?: boolean;
    /** A value indicating if the menu item is disabled. */
    disabled?: boolean;
};

/**
 * Creates the application menu structure with localization for the menu item names.
 * @param localize The localization function.
 * @param entry The currently selected category or item.
 * @param isNewFile A value indicating whether the file is a new file.
 * @param isfileChanged A value indicating whether the file has been changed.
 * @returns A localized menu structure for the application.
 */
const appMenuData = (localize: (entryName: string, defaultValue?: string | undefined) => string, entry: DataEntry | undefined, isNewFile: boolean, isfileChanged: boolean): MenuData[] => {
    return [
        {
            id: "1",
            name: localize("menuFile"),
            items: [
                {
                    id: "1_1",
                    name: localize("fileNew"),
                    actionName: "new",
                    icon: "file",
                },
                {
                    id: "1_2",
                    name: localize("fileOpen"),
                    actionName: "open",
                    icon: "folder",
                    disabled: isfileChanged,
                },
                {
                    id: "1_3",
                    name: localize("filePreferences"),
                    actionName: "file_preferences",
                    icon: "fas fa-sliders",
                },
                {
                    id: "1_4",
                    name: localize("fileClose"),
                    actionName: "close",
                    icon: "fas fa-file-circle-xmark",
                },
                {
                    id: "1_5",
                    name: localize("fileSave"),
                    actionName: "save",
                    icon: "save",
                    disabled: isfileChanged !== true,
                },
                {
                    id: "1_6",
                    name: localize("fileSaveAs"),
                    actionName: "saveas",
                    icon: "fas fa-floppy-disk",
                },
                {
                    beginGroup: true,
                    id: "1_7",
                    name: localize("appExit"),
                    actionName: "exit",
                    icon: "fas fa-door-open",
                },
            ],
        },
        {
            id: "2",
            name: localize("menuItems"),
            items: [
                {
                    id: "2_1",
                    name: localize("itemAdd"),
                    actionName: "additem",
                    icon: "add",
                    disabled: entry === undefined,
                },
                {
                    id: "2_2",
                    name: localize("itemAddCategory"),
                    actionName: "addcategory",
                    icon: "newfolder",
                },
                {
                    id: "2_3",
                    name: localize("itemEdit"),
                    actionName: "edit",
                    icon: "edit",
                    disabled: entry === undefined,
                },
                {
                    id: "2_4",
                    name: localize("itemDelete"),
                    actionName: "delete",
                    icon: "trash",
                    disabled: entry === undefined,
                },
            ],
        },
        {
            id: "3",
            name: localize("menuTools"),
            items: [
                {
                    id: "3_1",
                    name: localize("menuSettings"),
                    actionName: "settings",
                    icon: "preferences",
                },
                {
                    id: "3_2",
                    name: localize("help"),
                    actionName: "help",
                    icon: "help",
                },
                {
                    id: "3_3",
                    name: localize("about"),
                    actionName: "about",
                    icon: "info",
                },
            ],
        },
    ];
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
    /** Occurs when a menu item was clicked. */
    onItemClick: (e: ItemClickEvent) => void;
} & CommonProps;

/**
 * A component for the application menu for the PasswordKeeper.
 * @param param0 The component props {@link AppMenuProps}.
 * @returns A component.
 */
const AppMenu = ({
    className, //
    entry,
    onItemClick,
    isNewFile,
    isfileChanged,
}: AppMenuProps) => {
    const lm = useLocalize("menu");

    // Memoize the menu to prevent re-rendering all the time.
    const menuData = React.useMemo(() => {
        return appMenuData(lm, entry, isNewFile, isfileChanged);
    }, [entry, isNewFile, isfileChanged, lm]);

    return (
        <Menu //
            displayExpr="name"
            orientation="horizontal"
            className={classNames(AppMenu.name, className)}
            dataSource={menuData}
            onItemClick={onItemClick}
        />
    );
};

const StyledAppMenu = styled(AppMenu)`
    // Add style(s) here
`;

export { StyledAppMenu };

export type { MenuData };
