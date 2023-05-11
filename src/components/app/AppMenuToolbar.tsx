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
import classNames from "classnames";
import styled from "styled-components";
import { ItemClickEvent } from "devextreme/ui/menu";
import AppToolbar, { ToolBarProps } from "./AppToolbar";
import AppMenu, { AppMenuProps, MenuData } from "./AppMenu";

type Props = Omit<AppMenuProps, "onItemClick"> &
    ToolBarProps & {
        exitClick: () => void;
        newFileClick: () => void;
        settingsClick: () => void;
        aboutShowClick: () => void;
    };

const AppMenuToolbar = ({
    className, //
    entry,
    loadFileClick,
    saveFileClick,
    saveFileAsClick,
    editClick,
    addClick,
    addCategoryClick,
    exitClick,
    deleteClick,
    newFileClick,
    settingsClick,
    aboutShowClick,
    testClick,
}: Props) => {
    const onItemClick = React.useCallback(
        (e: ItemClickEvent) => {
            const clickedItem: MenuData = e.itemData as MenuData;

            switch (clickedItem.actionName) {
                case "open": {
                    loadFileClick();
                    break;
                }
                case "save": {
                    saveFileClick();
                    break;
                }
                case "saveas": {
                    saveFileAsClick();
                    break;
                }
                case "exit": {
                    exitClick();
                    break;
                }
                case "additem": {
                    addClick();
                    break;
                }
                case "addcategory": {
                    addCategoryClick();
                    break;
                }
                case "edit": {
                    editClick();
                    break;
                }
                case "delete": {
                    deleteClick();
                    break;
                }
                case "new": {
                    newFileClick();
                    break;
                }
                case "settings": {
                    settingsClick();
                    break;
                }
                case "about": {
                    aboutShowClick();
                    break;
                }

                default: {
                    break;
                }
            }
        },
        [aboutShowClick, addCategoryClick, addClick, deleteClick, editClick, exitClick, loadFileClick, newFileClick, saveFileAsClick, saveFileClick, settingsClick]
    );

    return (
        <>
            <AppMenu onItemClick={onItemClick} entry={entry} />
            <AppToolbar //
                className={classNames(AppToolbar.name, className)}
                entry={entry}
                saveFileClick={saveFileClick}
                saveFileAsClick={saveFileAsClick}
                loadFileClick={loadFileClick}
                editClick={editClick}
                addClick={addClick}
                addCategoryClick={addCategoryClick}
                deleteClick={deleteClick}
                testClick={testClick}
            />
        </>
    );
};

export default styled(AppMenuToolbar)`
    // Style here
`;
