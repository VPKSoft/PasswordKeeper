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

export type ToolBarProps = {
    className?: string;
    entry: DataEntry | undefined;
    canEdit?: boolean | undefined;
    saveFileClick: () => void;
    saveFileAsClick: () => void;
    loadFileClick: () => void;
    editClick: () => void;
    addClick: () => void;
    addCategoryClick: () => void;
    deleteClick: () => void;
    testClick?: () => void;
};

const AppToolbar = ({
    className, //
    entry,
    canEdit,
    loadFileClick,
    saveFileClick,
    saveFileAsClick,
    editClick,
    addClick,
    addCategoryClick,
    deleteClick,
    testClick,
}: ToolBarProps) => {
    return (
        <Toolbar className={classNames(AppToolbar.name, className)}>
            <ToolbarItem location="before">
                <Button //
                    icon="add"
                    onClick={addClick}
                    disabled={canEdit !== true}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="newfolder"
                    onClick={addCategoryClick}
                    disabled={canEdit !== true}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="edit"
                    onClick={editClick}
                    disabled={entry === undefined}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="trash"
                    onClick={deleteClick}
                    disabled={entry === undefined}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="save"
                    onClick={saveFileClick}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="./src/img/save-as-icon.svg"
                    onClick={saveFileAsClick}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="folder"
                    onClick={loadFileClick}
                />
            </ToolbarItem>
            <ToolbarItem location="before">
                <Button //
                    icon="help"
                    onClick={testClick}
                />
            </ToolbarItem>
        </Toolbar>
    );
};

export default styled(AppToolbar)``;
