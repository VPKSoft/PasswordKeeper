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
import styled from "styled-components";
import { ItemClickEvent } from "devextreme/ui/menu";
import { useLocalize } from "../../i18n";

const ActionValues = ["new", "open", "save", "saveas", "exit", "additem", "addcategory", "edit", "delete", "settings"] as const;
type ActionNames = (typeof ActionValues)[number];

type MenuData = {
    id: string;
    name: string;
    actionName?: ActionNames;
    items?: MenuData[];
    icon?: string;
    beginGroup?: boolean;
};

const appMenuData = (localize: (entryName: string, defaultValue?: string | undefined, params?: unknown) => string): MenuData[] => {
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
                },
                {
                    id: "1_3",
                    name: localize("fileSave"),
                    actionName: "save",
                    icon: "save",
                },
                {
                    id: "1_3",
                    name: localize("fileSaveAs"),
                    actionName: "saveas",
                    icon: "./src/img/save-as-icon.svg",
                },
                {
                    beginGroup: true,
                    id: "1_5",
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
                },
                {
                    id: "2_4",
                    name: localize("itemDelete"),
                    actionName: "delete",
                    icon: "trash",
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
            ],
        },
    ];
};

export type AppMenuProps = {
    className?: string;
    onItemClick: (e: ItemClickEvent) => void;
};

const AppMenu = ({
    className, //
    onItemClick,
}: AppMenuProps) => {
    const lm = useLocalize("menu");
    const menuData = React.useMemo(() => {
        return appMenuData(lm);
    }, [lm]);

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

export default styled(AppMenu)`
    // Add style here
`;

export type { MenuData };
