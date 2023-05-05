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
import styled from "styled-components";
import classNames from "classnames";
import notify from "devextreme/ui/notify";
import { exit } from "@tauri-apps/api/process";
import { useLocalize } from "./i18n";
import EditEntryPopup from "./components/software/EditEntryPopup";
import { DataEntry } from "./types/PasswordEntry";
import { FileQueryMode, ModifyType } from "./types/Enums";
import { newEntry } from "./misc/DataUtils";
import { setTheme } from "./utilities/ThemeUtils";
import EntryEditor from "./components/software/EntryEditor";
import PasswordList from "./components/app/PasswordList";
import EditCategoryPopup from "./components/software/EditCategoryPopup";
import { useSecureStorage } from "./utilities/hooks";
import StyledTitle from "./components/app/WindowTitle";
import { loadFile, saveFile } from "./utilities/app/Files";
import OpenSaveFilePopup from "./components/software/OpenSaveFilePopup";
import AppMenuToolbar from "./components/app/AppMenuToolbar";

type Props = {
    className?: string;
};

const App = ({ className }: Props) => {
    const la = useLocalize("app");

    const [entry, setEntry] = React.useState<DataEntry | undefined>();
    const [editEntry, setEditEntry] = React.useState<DataEntry | undefined>();
    const [entryEditVisible, setEntryEditVisible] = React.useState(false);
    const [categoryEditVisible, setCategoryEditVisible] = React.useState(false);
    const [dataSource, setDataSource] = React.useState<Array<DataEntry>>([]);
    const [currentFile, setCurrentFile] = React.useState(la("newFileName"));
    const [fileChanged, setFileChanged] = React.useState(false);
    const [fileSaveOpenQueryOpen, setFileSaveOpenQueryOpen] = React.useState(false);
    const [categoryPopupMode, setCategoryPopupMode] = React.useState<ModifyType>(ModifyType.New);
    const [filePopupMode, setFilePopupMode] = React.useState<FileQueryMode>(FileQueryMode.Open);
    const [isNewFile, setIsNewFile] = React.useState(true);

    const [setFilePassword, getFilePassword, clearFilePassword] = useSecureStorage<string>("filePassword", "");

    const lm = useLocalize("messages");

    setTheme("generic.carmine");

    const saveFileAsCallback = React.useCallback(() => {
        setFilePopupMode(FileQueryMode.SaveAs);
        setFileSaveOpenQueryOpen(true);
    }, []);

    const saveFileCallback = React.useCallback(async () => {
        if (isNewFile) {
            saveFileAsCallback();
        } else {
            const password = getFilePassword();
            if (currentFile && password) {
                saveFile(dataSource, password, currentFile).then(f => {
                    if (f.ok) {
                        setCurrentFile(f.fileName);
                        setFileChanged(false);
                    } else {
                        notify(lm("fileSaveFail", undefined, { msg: f.errorMessage }), "error", 5_000);
                    }
                });
            }
        }
    }, [currentFile, dataSource, getFilePassword, isNewFile, lm, saveFileAsCallback]);

    const loadFileCallback = React.useCallback(() => {
        setFilePopupMode(FileQueryMode.Open);
        setFileSaveOpenQueryOpen(true);
    }, []);

    const onEditClose = React.useCallback(
        (userAccepted: boolean, entry?: DataEntry | undefined) => {
            if (userAccepted && entry) {
                let newDataSource = [...dataSource];
                const index = newDataSource.findIndex(f => f.id === entry?.id);
                if (index !== -1) {
                    newDataSource = newDataSource.splice(index, 1);
                }
                setDataSource(newDataSource);
            }
            setEntryEditVisible(false);
        },
        [dataSource]
    );

    const onCategoryEditClose = React.useCallback(
        (userAccepted: boolean, entry?: DataEntry | undefined) => {
            if (userAccepted && categoryPopupMode === ModifyType.New && userAccepted && entry !== undefined) {
                setDataSource([...dataSource, entry]);
            }
            setCategoryEditVisible(false);
        },
        [categoryPopupMode, dataSource]
    );

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
                if (filePopupMode === FileQueryMode.Open) {
                    void loadFile(password, fileName).then(f => {
                        if (f.ok) {
                            setFilePassword(password);
                            setDataSource(f.fileData);
                            setCurrentFile(fileName);

                            setFileSaveOpenQueryOpen(false);
                            setIsNewFile(false);
                        } else {
                            notify(lm("fileOpenFail", undefined, { msg: f.errorMessage }), "error", 5_000);
                            setFileSaveOpenQueryOpen(false);
                        }
                    });
                } else if (filePopupMode === FileQueryMode.SaveAs) {
                    void saveFile(dataSource, password, fileName).then(f => {
                        if (f.ok) {
                            setFilePassword(password);
                            setCurrentFile(fileName);
                            setFileSaveOpenQueryOpen(false);
                        } else {
                            notify(lm("fileSaveFail", undefined, { msg: f.errorMessage }), "error", 5_000);
                            setFileSaveOpenQueryOpen(false);
                        }
                    });
                }
            } else {
                setFileSaveOpenQueryOpen(false);
            }
        },
        [dataSource, filePopupMode, lm, setFilePassword]
    );

    const exitClick = React.useCallback(() => {
        exit(0);
    }, []);

    const deleteClick = React.useCallback(() => {
        // TODO::Implement item / category deletion.
    }, []);

    const settingsClick = React.useCallback(() => {
        // TODO::Implement preferences popup.
    }, []);

    const newClick = React.useCallback(() => {
        setDataSource([]);
        setCurrentFile(la("newFileName"));
        // eslint-disable-next-line unicorn/no-useless-undefined
        setEditEntry(undefined);
        // eslint-disable-next-line unicorn/no-useless-undefined
        setEntry(undefined);
        setIsNewFile(true);
        clearFilePassword();
    }, [clearFilePassword, la]);

    const addCategoryClick = React.useCallback(() => {
        setCategoryPopupMode(ModifyType.New);
        setEditEntry(newEntry(-1, dataSource, ""));
        setCategoryEditVisible(true);
    }, [dataSource]);

    const canEdit = React.useMemo(() => {
        return editEntry !== undefined && currentFile !== "";
    }, [currentFile, editEntry]);

    React.useEffect(() => {
        if (entry) {
            setEditEntry({ ...entry });
            setCategoryPopupMode(ModifyType.Edit);
        }
    }, [entry]);

    return (
        <>
            <StyledTitle title={title} />

            <div className={classNames(App.name, className)}>
                <AppMenuToolbar //
                    entry={entry}
                    saveFileClick={saveFileCallback}
                    saveFileAsClick={saveFileAsCallback}
                    loadFileClick={loadFileCallback}
                    editClick={onEditClick}
                    addClick={() => setEntryEditVisible(true)}
                    addCategoryClick={addCategoryClick}
                    newFileClick={newClick}
                    settingsClick={settingsClick}
                    exitClick={exitClick}
                    deleteClick={deleteClick}
                    canEdit={canEdit}
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
                    entry={editEntry}
                    mode={ModifyType.Edit}
                    visible={entryEditVisible}
                    onClose={onEditClose}
                />
                {editEntry !== undefined && (
                    <EditCategoryPopup //
                        entry={editEntry}
                        mode={categoryPopupMode}
                        visible={categoryEditVisible}
                        onClose={onCategoryEditClose}
                    />
                )}
                <OpenSaveFilePopup //
                    visible={fileSaveOpenQueryOpen}
                    onClose={filePopupClose}
                    mode={filePopupMode}
                    currentFile={currentFile}
                />
            </div>
        </>
    );
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
