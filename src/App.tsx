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
import AppToolbar from "./components/app/AppToolbar";
import FileQueryTextbox from "./components/software/FileQueryTextbox";
import OpenFilePopup from "./components/software/OpenFilePopup";
import notify from "devextreme/ui/notify";

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
    const [openFile, setOpenFile] = React.useState(false);

    const la = useLocalize("app");
    const lm = useLocalize("messages");

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
        setOpenFile(true);
    }, []);

    const onEditClose = React.useCallback((userAccepted: boolean, entry?: DataEntry | undefined) => {
        if (userAccepted) {
            // TODO::Save the data
        }
        setEntryEditVisible(false);
    }, []);

    const onCategoryEditClose = React.useCallback((userAccepted: boolean, entry?: DataEntry | undefined) => {
        if (userAccepted) {
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

    const filePopupClose = React.useCallback(
        (userAccepted: boolean, fileName?: string, password?: string) => {
            if (userAccepted === true && fileName !== undefined && password !== undefined) {
                void loadFile(password, fileName).then(f => {
                    if (f.ok) {
                        setDataSource(f.fileData);
                    } else {
                        setOpenFile(false);
                        notify(lm("fileOpenFail", undefined, { msg: f.errorMessage }), "error", 5_000);
                    }

                    setOpenFile(false);
                });
            }
        },
        [lm]
    );

    return (
        <>
            <StyledTitle title={title} />

            <div className={classNames(App.name, className)}>
                <AppToolbar //
                    entry={entry}
                    saveFileClick={saveFileCallback}
                    loadFileClick={loadFileCallback}
                    editClick={onEditClick}
                    addClick={() => setEntryEditVisible(true)}
                    testClick={() => setQueryPasswordVisible(value => !value)}
                />
                <div className="App-itemsView">
                    <PasswordList //
                        dataSource={dataSource}
                        setDataSource={setDataSource}
                        className="App-itemsView-list"
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
                    verifyMode={false}
                    initialShowPassword={false}
                />
                <OpenFilePopup //
                    visible={openFile}
                    onClose={filePopupClose}
                />
            </div>
        </>
    );
};

const queryPasswordClose = (userAccepted: boolean, password?: string) => {
    console.log(userAccepted, password);
};

export default styled(App)`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction column;
    .App-itemsView {
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
    .App-itemsView-list {
        width: 40%;
    }
`;
