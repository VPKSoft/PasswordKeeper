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

import * as React from "react";
import classNames from "classnames";
import { styled } from "styled-components";
import { AppToolbarProps, StyledAppToolbar } from "./AppToolbar";
import { ActionNames, AppMenuProps, StyledAppMenu } from "./AppMenu";

/**
 * The props for the {@link AppMenuToolbar} component.
 */
type AppMenuToolbarProps = Omit<AppMenuProps, "onItemClick"> &
    AppToolbarProps & {
        /** Occurs when the  item was clicked. */
        exitClick: () => void;
        /** Occurs when the new file item was clicked. */
        newFileClick: () => void;
        /** Occurs when the preferences item was clicked. */
        settingsClick: () => void;
        /** Occurs when the about item was clicked. */
        aboutShowClick: () => void;
        /** Occurs when the close file item was clicked. */
        fileCloseClick: () => void;
        /** Occurs when the help item was clicked. */
        onHelpClick: () => void;
    };

/**
 * A component for the application toolbar and menu for the PasswordKeeper.
 * @param param0 The component props: {@link AppMenuToolbarProps}.
 * @returns A component.
 */
const AppMenuToolbar = ({
    className, //
    entry,
    isNewFile,
    isfileChanged,
    searchValue,
    searchValueChanged,
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
    lockViewClick,
    fileCloseClick,
    onHelpClick,
    filePreferencesClick,
    testClick,
}: AppMenuToolbarProps) => {
    const onItemClick = React.useCallback(
        (action: ActionNames) => {
            switch (action) {
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
                case "close": {
                    fileCloseClick();
                    break;
                }

                case "help": {
                    onHelpClick();
                    break;
                }

                case "file_preferences": {
                    filePreferencesClick();
                    break;
                }

                default: {
                    break;
                }
            }
        },
        [
            aboutShowClick,
            addCategoryClick,
            addClick,
            deleteClick,
            editClick,
            exitClick,
            fileCloseClick,
            filePreferencesClick,
            loadFileClick,
            newFileClick,
            onHelpClick,
            saveFileAsClick,
            saveFileClick,
            settingsClick,
        ]
    );

    return (
        <div className={classNames(AppMenuToolbar.name, className)}>
            <StyledAppMenu //
                onItemClick={onItemClick}
                entry={entry}
                isNewFile={isNewFile}
                isfileChanged={isfileChanged}
            />
            <StyledAppToolbar //
                entry={entry}
                saveFileClick={saveFileClick}
                saveFileAsClick={saveFileAsClick}
                loadFileClick={loadFileClick}
                editClick={editClick}
                addClick={addClick}
                addCategoryClick={addCategoryClick}
                deleteClick={deleteClick}
                lockViewClick={lockViewClick}
                searchValue={searchValue}
                searchValueChanged={searchValueChanged}
                filePreferencesClick={filePreferencesClick}
                testClick={testClick}
            />
        </div>
    );
};

const StyledAppMenuToolbar = styled(AppMenuToolbar)`
    display: flex;
    flex-direction: column;
    min-height: 0px;
    margin-bottom: 10px;
`;

export { StyledAppMenuToolbar };
