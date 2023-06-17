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
import { Button, Toolbar } from "devextreme-react";
import { Item as ToolbarItem } from "devextreme-react/toolbar";
import styled from "styled-components";
import classNames from "classnames";
import { DataEntry } from "../../types/PasswordEntry";
import { useLocalize } from "../../i18n";
import { CommonProps } from "../Types";

/**
 * The props for the @see AppToolbar component.
 */
export type ToolBarProps = {
    /** The currently selected @see DataEntry item. */
    entry: DataEntry | undefined;
    /** Occurs when the save file item was clicked. */
    saveFileClick: () => void;
    /** Occurs when the save file as item was clicked. */
    saveFileAsClick: () => void;
    /** Occurs when the open file item was clicked. */
    loadFileClick: () => void;
    /** Occurs when the edit category or entry item was clicked. */
    editClick: () => void;
    /** Occurs when the add entry item was clicked. */
    addClick: () => void;
    /** Occurs when the add category item was clicked. */
    addCategoryClick: () => void;
    /** Occurs when the delete category or entry item was clicked. */
    deleteClick: () => void;
    /** Occurs when the lock view item was clicked. */
    lockViewClick: () => void;
    /** Occurs when the test something item was clicked. ONLY for development purposes; do not define in production. */
    testClick?: () => void;
} & CommonProps;

/**
 * A component for the application toolbar for the PasswordKeeper.
 * @param param0 The component props @see ToolBarProps.
 * @returns A component.
 */
const AppToolbar = ({
    className, //
    entry,
    loadFileClick,
    saveFileClick,
    saveFileAsClick,
    editClick,
    addClick,
    addCategoryClick,
    deleteClick,
    lockViewClick,
    testClick,
}: ToolBarProps) => {
    const lm = useLocalize("menu");
    return (
        <Toolbar className={classNames(AppToolbar.name, className)}>
            <ToolbarItem location="before">
                <Button //
                    icon="add"
                    onClick={addClick}
                    disabled={entry === undefined}
                    hint={lm("itemAdd")}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="newfolder"
                    onClick={addCategoryClick}
                    hint={lm("itemAddCategory")}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="edit"
                    onClick={editClick}
                    disabled={entry === undefined}
                    hint={lm("itemEdit")}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="trash"
                    onClick={deleteClick}
                    disabled={entry === undefined}
                    hint={lm("itemDelete")}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="save"
                    onClick={saveFileClick}
                    hint={lm("fileSave")}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="fas fa-floppy-disk"
                    onClick={saveFileAsClick}
                    hint={lm("fileSaveAs")}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="folder"
                    onClick={loadFileClick}
                    hint={lm("fileOpen")}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="lock"
                    onClick={lockViewClick}
                    hint={lm("lockView")}
                />
            </ToolbarItem>
            {testClick && (
                <ToolbarItem location="before">
                    <Button //
                        icon="help"
                        onClick={testClick}
                        hint="Test stuff"
                    />
                </ToolbarItem>
            )}
        </Toolbar>
    );
};

export default styled(AppToolbar)`
    // Add style(s) here
`;
