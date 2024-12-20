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
    faFloppyDisk,
    faFolderOpen,
    faHammer,
    faLock,
    faPen,
    faSliders,
    faSquarePlus,
    faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tooltip } from "antd";
import classNames from "classnames";
import * as React from "react";
import { styled } from "styled-components";
import { useLocalize } from "../../I18n";
import type { DataEntry } from "../../types/PasswordEntry";
import type { CommonProps } from "../Types";
import { type SearchTextBoxValue, StyledSearchTextBox } from "../reusable/inputs/SearchTextBox";
import { darkModeMenuBackground, lightModeMenuBackground } from "./AntdConstants";

/**
 * The props for the {@link AppToolbar} component.
 */
export type AppToolbarProps = {
    /** The currently selected {@link DataEntry} item. */
    entry: DataEntry | undefined;
    /** A search value for filtering the password list. */
    searchValue: SearchTextBoxValue;
    /** A value indicating whether to use dark mode with the application. */
    darkMode: boolean;
    /** Occurs when the value of the search input has been changed. */
    searchValueChanged?: (value: SearchTextBoxValue) => void;
    /** Occurs when the save file item was clicked. */
    saveFileClick: () => void;
    /** Occurs when the save file as item was clicked. */
    saveFileAsClick: () => void;
    /** Occurs when the open file item was clicked. */
    loadFileClick: () => void;
    /** Occurs when the edit entry item was clicked. */
    editClick: () => void;
    /** Occurs when the add entry item was clicked. */
    addClick: () => void;
    /** Occurs when the delete entry item was clicked. */
    deleteClick: () => void;
    /** Occurs when the lock view item was clicked. */
    lockViewClick: () => void;
    /** Occurs the file preferences item was clicked. */
    filePreferencesClick: () => void;
    /** Occurs when the test something item was clicked. ONLY for development purposes; do not define in production. */
    testClick?: () => void;
} & CommonProps;

/**
 * A component for the application toolbar for the PasswordKeeper.
 * @param param0 The component props {@link AppToolbarProps}.
 * @returns A component.
 */
const AppToolbar = ({
    className, //
    entry,
    searchValue,
    searchValueChanged,
    loadFileClick,
    saveFileClick,
    saveFileAsClick,
    editClick,
    addClick,
    deleteClick,
    lockViewClick,
    filePreferencesClick,
    testClick,
}: AppToolbarProps) => {
    const lm = useLocalize("menu");
    const ls = useLocalize("settings");

    // Clear the search box when the Escape key is pressed.
    const onSearchKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.code === "Escape") {
                searchValueChanged?.({ ...searchValue, value: "" });
                e.preventDefault();
            }
        },
        [searchValue, searchValueChanged]
    );

    return (
        <div className={classNames(AppToolbar.name, className)}>
            <Tooltip title={lm("itemAdd")}>
                <Button //
                    icon={<FontAwesomeIcon icon={faSquarePlus} />}
                    onClick={addClick}
                />
            </Tooltip>
            <Tooltip title={lm("itemEdit")}>
                <Button //
                    icon={<FontAwesomeIcon icon={faPen} />}
                    onClick={editClick}
                    disabled={entry === undefined}
                />
            </Tooltip>
            <Tooltip title={lm("itemDelete")}>
                <Button //
                    icon={<FontAwesomeIcon icon={faTrashCan} />}
                    onClick={deleteClick}
                    disabled={entry === undefined}
                />
            </Tooltip>
            <Tooltip title={lm("fileSave")}>
                <Button //
                    icon={<FontAwesomeIcon icon={faFloppyDiskSave} />}
                    onClick={saveFileClick}
                />
            </Tooltip>
            <Tooltip title={lm("fileSaveAs")}>
                <Button //
                    icon={<FontAwesomeIcon icon={faFloppyDisk} />}
                    onClick={saveFileAsClick}
                />
            </Tooltip>
            <Tooltip title={lm("fileOpen")}>
                <Button //
                    icon={<FontAwesomeIcon icon={faFolderOpen} />}
                    onClick={loadFileClick}
                />
            </Tooltip>
            <Tooltip title={lm("lockView")}>
                <Button //
                    icon={<FontAwesomeIcon icon={faLock} />}
                    onClick={lockViewClick}
                />
            </Tooltip>
            <Tooltip title={ls("filePreferences")}>
                <Button //
                    icon={<FontAwesomeIcon icon={faSliders} />}
                    onClick={filePreferencesClick}
                />
            </Tooltip>
            <StyledSearchTextBox //
                value={searchValue}
                onValueChanged={searchValueChanged}
                className="AppToolbar-searchBox"
                onKeyDown={onSearchKeyDown}
            />
            {testClick && (
                <Tooltip title="Test stuff">
                    <Button //
                        icon={<FontAwesomeIcon icon={faHammer} />}
                        onClick={testClick}
                    />
                </Tooltip>
            )}
        </div>
    );
};

const StyledAppToolbar = styled(AppToolbar)`
    display: flex;
    flex-direction: row;
    gap: 4px;
    .AppToolbar-searchBox {
        width: 480px;
        margin-left: auto;
    }
    padding-bottom: 4px;
    background-color: ${props => (props.darkMode ? darkModeMenuBackground : lightModeMenuBackground)};
`;

export { StyledAppToolbar };
