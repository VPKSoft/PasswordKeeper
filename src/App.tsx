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
import "./App.css";
import { Button, Toolbar } from "devextreme-react";
import styled from "styled-components";
import "./i18n";
import "@fluentui/react-icons";
import { save, open } from "@tauri-apps/api/dialog";
import EditEntryPopup from "./components/software/EditEntryPopup";
import { DataEntry } from "./types/PasswordEntry";
import { ModifyType } from "./types/Enums";
import { useLocalize } from "./i18n";
import { Item as ToolbarItem } from "devextreme-react/toolbar";
import classNames from "classnames";
import { newEntry, testData } from "./misc/TestData";
import { setTheme } from "./utilities/ThemeUtils";
import EntryEditor from "./components/software/EntryEditor";
import PasswordList from "./components/app/PasswordList";
import { invoke } from "@tauri-apps/api/tauri";
import EditCategoryPopup from "./components/software/EditCategoryPopup";
import { useSecureStorage } from "./utilities/hooks";
import StyledTitle from "./components/app/WindowTitle";
import { loadFile, saveFile } from "./utilities/app/Files";
import QueryPasswordPopup from "./components/software/QueryPasswordPopup";

type Props = {
    className?: string;
};

const App = ({ className }: Props) => {
    const [entry, setEntry] = React.useState<DataEntry | undefined>();
    const [entryEditVisible, setEntryEditVisible] = React.useState(false);
    const [categoryEditVisible, setCategoryEditVisible] = React.useState(false);
    const [dataSource, setDataSource] = React.useState(testData);
    const [currentFile, setCurrentFile] = React.useState<string>();
    const [fileChanged, setFileChanged] = React.useState(false);
    const [setFilePassword, getFilePassword, clearFilePassword] = useSecureStorage<string>("filePassword");
    const [queryPasswordVisible, setQueryPasswordVisible] = React.useState(false);

    const la = useLocalize("app");

    setTheme("generic.carmine");

    setFilePassword("password");

    const saveFileCallback = React.useCallback(async () => {
        saveFile(dataSource, "password", la("passwordKeeperDataFile", "PasswordKeeper data file")).then(f => {
            if (f.ok) {
                setCurrentFile(f.fileName);
                setFileChanged(false);
            }
        });
    }, [dataSource, la]);

    const loadFileCallback = React.useCallback(async () => {
        loadFile("pwd", la("passwordKeeperDataFile", "PasswordKeeper data file")).then(result => {
            if (result.ok) {
                setDataSource(result.fileData);
                setCurrentFile(result.fileName);
            }
        });
    }, [la]);

    const onEditClose = React.useCallback((useAccepted: boolean, entry?: DataEntry | undefined) => {
        if (useAccepted) {
            // TODO::Save the data
        }
        setEntryEditVisible(false);
    }, []);

    const onCategoryEditClose = React.useCallback((useAccepted: boolean, entry?: DataEntry | undefined) => {
        if (useAccepted) {
            // TODO::Save the data
        }
        setCategoryEditVisible(false);
    }, []);

    const onEditClick = React.useCallback(() => {
        if (entry?.parentId === -1) {
            setCategoryEditVisible(true);
        } else if (entry) {
            setEntryEditVisible(true);
        }
    }, [entry]);

    const title = React.useMemo(() => {
        const fileChangeIndicator = fileChanged ? " *" : "";
        return currentFile === undefined ? "Password Keeper" : `Password Keeper [${currentFile}${fileChangeIndicator}]`;
    }, [currentFile, fileChanged]);

    return (
        <>
            <StyledTitle title={title} />

            <div className={classNames(App.name, className)}>
                <Toolbar>
                    <ToolbarItem location="before">
                        <Button //
                            icon="add"
                            onClick={() => setEntryEditVisible(true)}
                            disabled={entry === undefined}
                        />
                    </ToolbarItem>
                    <ToolbarItem location="before">
                        <Button //
                            icon="edit"
                            onClick={onEditClick}
                            disabled={entry === undefined}
                        />
                    </ToolbarItem>
                    <ToolbarItem location="before">
                        <Button //
                            icon="save"
                            onClick={saveFileCallback}
                        />
                    </ToolbarItem>
                    <ToolbarItem location="before">
                        <Button //
                            icon="folder"
                            onClick={loadFileCallback}
                        />
                    </ToolbarItem>
                    <ToolbarItem location="before">
                        <Button //
                            icon="help"
                            onClick={() => setQueryPasswordVisible(value => !value)}
                        />
                    </ToolbarItem>
                </Toolbar>
                <div className="App-itemsWiew">
                    <PasswordList //
                        dataSource={dataSource}
                        setDataSource={setDataSource}
                        className="App-itemsWiew-list"
                        setEntry={setEntry}
                    />
                    <EntryEditor //
                        className="App-PasswordEntryEditor"
                        entry={entry}
                        readOnly={true}
                        visible={entry?.parentId !== -1}
                        hidePasswordTimeout={10}
                        showCopyButton={true}
                    />
                </div>
                <EditEntryPopup //
                    entry={entry}
                    mode={ModifyType.Edit}
                    visible={entryEditVisible}
                    onClose={onEditClose}
                />
                {entry && (
                    <EditCategoryPopup //
                        entry={entry}
                        mode={ModifyType.Edit}
                        visible={categoryEditVisible}
                        onClose={onCategoryEditClose}
                    />
                )}
                <QueryPasswordPopup //
                    visible={queryPasswordVisible}
                    onClose={queryPasswordClose}
                    verifyMode={true}
                    initialShowPassword={false}
                />
            </div>
        </>
    );
};

const queryPasswordClose = (useAccepted: boolean, password?: string) => {
    console.log(useAccepted, password);
};

export default styled(App)`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction column;
    .App-itemsWiew {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction row;
        min-height: 0;
    }
    .App-PasswordEntryEditor {
        width: 60%;
        margin: 10px;
    }
    .App-itemsWiew-list {
        width: 40%;
    }
`;
