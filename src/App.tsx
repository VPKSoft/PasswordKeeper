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
import { appWindow } from "@tauri-apps/api/window";
import notify from "devextreme/ui/notify";
import { exit } from "@tauri-apps/api/process";
import { ask } from "@tauri-apps/api/dialog";
import dxTreeList, { Node } from "devextreme/ui/tree_list";
import { Locales, setLocale, useLocalize } from "./i18n";
import EditEntryPopup from "./components/software/popups/EditEntryPopup";
import { DataEntry } from "./types/PasswordEntry";
import { DialogButtons, DialogResult, FileQueryMode, ModifyType, PopupType } from "./types/Enums";
import { deleteEntryOrCategory, newEntry, updateDataSource } from "./misc/DataUtils";
import { setTheme } from "./utilities/ThemeUtils";
import EntryEditor from "./components/software/EntryEditor";
import EditCategoryPopup from "./components/software/popups/EditCategoryPopup";
import { useSecureStorage } from "./utilities/hooks";
import StyledTitle from "./components/app/WindowTitle";
import { loadFile, saveFile } from "./utilities/app/Files";
import AppMenuToolbar from "./components/app/AppMenuToolbar";
import PasswordList from "./components/reusable/PasswordList";
import OpenSaveFilePopup from "./components/software/popups/OpenSaveFilePopup";
import ConfirmPopup from "./components/software/popups/ConfirmPopup";
import PreferencesPopup from "./components/software/popups/PreferencesPopup";
import { Settings, loadSettings, saveSettings } from "./types/Settings";
import AboutPopup from "./components/software/popups/AboutPopup";
import LockScreenOverlay from "./components/reusable/LockScreenOverlay";
import QueryPasswordPopup from "./components/software/popups/QueryPasswordPopup";
import useTimeout, { TimeInterval } from "./hooks/UseTimeout";

type Props = {
    className?: string;
};

const App = ({ className }: Props) => {
    const la = useLocalize("app");
    const lm = useLocalize("messages");
    const ls = useLocalize("settings");

    const [entry, setEntry] = React.useState<DataEntry | null>(null);
    const [editEntry, setEditEntry] = React.useState<DataEntry | null>(null);
    const [entryEditVisible, setEntryEditVisible] = React.useState(false);
    const [categoryEditVisible, setCategoryEditVisible] = React.useState(false);
    const [dataSource, setDataSource] = React.useState<Array<DataEntry>>([]);
    const [currentFile, setCurrentFile] = React.useState(la("newFileName"));
    const [fileChanged, setFileChanged] = React.useState(false);
    const [fileSaveOpenQueryOpen, setFileSaveOpenQueryOpen] = React.useState(false);
    const [categoryPopupMode, setCategoryPopupMode] = React.useState<ModifyType>(ModifyType.New);
    const [filePopupMode, setFilePopupMode] = React.useState<FileQueryMode>(FileQueryMode.Open);
    const [entryEditMode, setEntryEditMode] = React.useState<ModifyType>(ModifyType.New);
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [preferencesVisible, setPreferencesVisible] = React.useState(false);
    const [aboutVisible, setAboutVisible] = React.useState(false);
    const [settingsLoaded, setSettingsLoaded] = React.useState(false);
    const [viewLocked, setViewLocked] = React.useState(false);
    const [lockPasswordQueryVisible, setLockPasswordQueryVisible] = React.useState(false);
    const [timeOut, setTimeOut] = React.useState(10);
    const [passwordFailedCount, setPasswordFailedCount] = React.useState(0);

    const treeListRef = React.useRef<dxTreeList>();

    // A call back to lock the main window and close the popups if any.
    const onViewLockTimeout = React.useCallback(() => {
        setViewLocked(true);
        // Hide the entry editor to hide sensitive data.
        setEditEntry(null);
        setEntry(null);

        // Hide the dialogs.
        setFileSaveOpenQueryOpen(false);
        setDialogVisible(false);
        setAboutVisible(false);
        setLockPasswordQueryVisible(false);
        setPreferencesVisible(false);

        // Collapse the tree. The categories are allowed to show.
        collapseTree(treeListRef?.current);
    }, []);

    const [setTimeoutEnabled, resetTimeOut] = useTimeout(timeOut, onViewLockTimeout, TimeInterval.Minutes);

    const settingsRef = React.useRef<Settings>();

    const [isNewFile, setIsNewFile] = React.useState(true);

    const [setFilePassword, getFilePassword, clearFilePassword] = useSecureStorage<string>("filePassword", "");

    const applySettings = React.useCallback(
        (value: Settings) => {
            settingsRef.current = value;
            setTheme(value.dx_theme);
            setLocale((value.locale ?? "en") as Locales);
            setTimeoutEnabled(value.lock_timeout > 0);
            setTimeOut(value.lock_timeout);
            setSettingsLoaded(true);
        },
        [setTimeoutEnabled]
    );

    React.useEffect(() => {
        void loadSettings().then(f => {
            if (f) {
                applySettings(f);
            }
        });
    }, [applySettings, setTimeoutEnabled]);

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

    const fileSaveQueryAbortCloseCallback = React.useCallback(async () => {
        if (fileChanged) {
            let result = false;
            const dialogResult = await ask(lm("fileChangedSaveQuery", undefined, { file: currentFile }), { title: lm("fileChangedTitle") });
            if (dialogResult) {
                void saveFileCallback();
                result = true; // True for abort close
            }

            return result;
        } else {
            return false;
        }
    }, [currentFile, fileChanged, lm, saveFileCallback]);

    const loadFileCallback = React.useCallback(() => {
        setFilePopupMode(FileQueryMode.Open);
        setFileSaveOpenQueryOpen(true);
    }, []);

    React.useEffect(() => {
        const unlisten = appWindow.onCloseRequested(async event => {
            const confirmed = await fileSaveQueryAbortCloseCallback();
            if (confirmed) {
                // User did not confirm closing the window; let's prevent it.
                event.preventDefault();
            }
        });

        return () => {
            unlisten.then(f => f());
        };
    }, [fileSaveQueryAbortCloseCallback]);

    const onEditClose = React.useCallback(
        (userAccepted: boolean, entry?: DataEntry | undefined) => {
            if (userAccepted && entry) {
                setDataSource(updateDataSource(dataSource, entry));
                setEntry(entry);
                setEditEntry(null);
                setFileChanged(true);
            }
            setEntryEditVisible(false);
        },
        [dataSource]
    );

    const onCategoryEditClose = React.useCallback(
        (userAccepted: boolean, entry?: DataEntry | undefined) => {
            if (userAccepted && entry !== undefined) {
                setDataSource(updateDataSource(dataSource, entry));
                setFileChanged(true);
            }
            setCategoryEditVisible(false);
            setEditEntry(null);
        },
        [dataSource]
    );

    // The user requested to edit a selected entry or category. Set the editor visible.
    const onEditClick = React.useCallback(() => {
        if (entry) {
            setEditEntry({ ...entry });
            if (entry?.parentId === -1) {
                setCategoryPopupMode(ModifyType.Edit);
                setCategoryEditVisible(true);
            } else if (entry) {
                setEntryEditMode(ModifyType.Edit);
                setEntryEditVisible(true);
            }
        }
    }, [entry]);

    // Memoize the application title based on the current file and whether it is changed.
    const title = React.useMemo(() => {
        const fileChangeIndicator = fileChanged ? " *" : "";
        return currentFile === undefined ? "Password Keeper" : `Password Keeper [${currentFile}${fileChangeIndicator}]`;
    }, [currentFile, fileChanged]);

    // Increase the failed password count, display a warning message and close the program
    // if the failed password counter reached its predefined limit.
    const increaseFileLockFail = React.useCallback(() => {
        // If the setting is disabled, do nothing.
        if ((settingsRef.current?.failed_unlock_attempts ?? 0) === 0) {
            return;
        }

        const failed = passwordFailedCount + 1;
        setPasswordFailedCount(failed);
        const lockAfter = (settingsRef.current?.failed_unlock_attempts ?? 0) - failed;
        if (lockAfter > 0) {
            // Notify about the erroneous password.
            notify(lm("passwordFailLockWarning", undefined, { lockAfter: lockAfter }), "warning", 5_000);
        } else {
            // The count exceeded, exit the software.
            exit(0);
        }
    }, [lm, passwordFailedCount]);

    // The file popup was closed. If the user accepted the popup.
    // Depending on the popup mode and user input either open an existing file or save new file.
    const filePopupClose = React.useCallback(
        (userAccepted: boolean, fileName?: string, password?: string) => {
            if (userAccepted === true && fileName !== undefined && password !== undefined) {
                if (filePopupMode === FileQueryMode.Open) {
                    void loadFile(password, fileName).then(f => {
                        if (f.ok) {
                            setFilePassword(password);
                            setDataSource(f.fileData);
                            setCurrentFile(fileName);
                            setFileChanged(false);
                            setIsNewFile(false);
                            setPasswordFailedCount(0);
                        } else {
                            notify(lm("fileOpenFail", undefined, { msg: f.errorMessage }), "error", 5_000);
                            increaseFileLockFail();
                        }
                    });
                } else if (filePopupMode === FileQueryMode.SaveAs) {
                    void saveFile(dataSource, password, fileName).then(f => {
                        if (f.ok) {
                            setFilePassword(password);
                            setCurrentFile(fileName);
                            setIsNewFile(false);
                            setFileChanged(false);
                        } else {
                            notify(lm("fileSaveFail", undefined, { msg: f.errorMessage }), "error", 5_000);
                        }
                    });
                }
            }
            setFileSaveOpenQueryOpen(false);
        },
        [dataSource, filePopupMode, increaseFileLockFail, lm, setFilePassword]
    );

    const exitClick = React.useCallback(() => {
        fileSaveQueryAbortCloseCallback().then(result => {
            if (!result) {
                exit(0);
            }
        });
    }, [fileSaveQueryAbortCloseCallback]);

    const deleteClick = React.useCallback(() => {
        setDialogVisible(true);
    }, []);

    const settingsClick = React.useCallback(() => {
        setPreferencesVisible(true);
    }, []);

    const newClick = React.useCallback(() => {
        setDataSource([]);
        setCurrentFile(la("newFileName"));
        setEditEntry(null);
        setEntry(null);
        setIsNewFile(true);
        clearFilePassword();
    }, [clearFilePassword, la]);

    const addCategoryClick = React.useCallback(() => {
        setCategoryPopupMode(ModifyType.New);
        setEditEntry(newEntry(-1, dataSource, ""));
        setCategoryEditVisible(true);
    }, [dataSource]);

    const addItem = React.useCallback(() => {
        if (entry) {
            setEntryEditMode(ModifyType.New);
            const parentId = entry.parentId === -1 ? entry.id : entry.parentId;
            const editEntry = newEntry(parentId, dataSource, "");
            setEditEntry(editEntry);
            setEntryEditVisible(true);
        }
    }, [dataSource, entry]);

    const deleteQueryMessage = React.useMemo(() => {
        const message = entry?.parentId === -1 ? lm("queryDeleteCategory", undefined, { category: entry?.name }) : lm("queryDeleteEntry", undefined, { entry: entry?.name });
        return message;
    }, [entry, lm]);

    const deleteCategoryOrEntry = React.useCallback(
        (e: DialogResult) => {
            if (e === DialogResult.Yes && entry) {
                setDataSource(deleteEntryOrCategory(dataSource, entry));
            }
            setDialogVisible(false);
        },
        [dataSource, entry]
    );

    const preferencesClose = React.useCallback(
        (userAccepted: boolean, settings?: Settings) => {
            if (userAccepted && settings) {
                saveSettings(settings).then(f => {
                    if (f) {
                        applySettings(settings);
                        if (fileChanged) {
                            notify({ message: ls("themeChangeFailFileUnsaved"), width: 300, shading: true, displayTime: 5_000, type: "warning" }, { position: "bottom center", direction: "up-push" });
                            notify({ message: ls("saveSuccess"), width: 300, shading: true, displayTime: 5_000, type: "success" }, { position: "bottom center", direction: "up-push" });
                        } else {
                            window.location.reload();
                            notify(ls("saveSuccess"), "success", 5_000);
                        }
                    } else {
                        notify(ls("saveFailed"), "error", 5_000);
                    }
                });
            }
            setPreferencesVisible(false);
        },
        [applySettings, fileChanged, ls]
    );

    const aboutShowClick = React.useCallback(() => {
        setAboutVisible(true);
    }, []);

    const aboutClose = React.useCallback(() => {
        setAboutVisible(false);
    }, []);

    const lockOverlayClick = React.useCallback(() => {
        if (isNewFile) {
            setViewLocked(false);
        } else {
            setLockPasswordQueryVisible(true);
            setViewLocked(false);
        }
    }, [isNewFile]);

    const lockViewClick = React.useCallback(() => {
        setViewLocked(true);
    }, []);

    const queryUnlockPassword = React.useCallback(
        (userAccepted: boolean, password?: string) => {
            setLockPasswordQueryVisible(false);
            if (userAccepted) {
                if (password === getFilePassword()) {
                    setViewLocked(false);
                    setPasswordFailedCount(0);
                } else {
                    increaseFileLockFail();
                    setViewLocked(true);
                }
            } else {
                setViewLocked(true);
            }
        },
        [getFilePassword, increaseFileLockFail]
    );

    if (!settingsLoaded) {
        return null;
    }

    return (
        <>
            <StyledTitle //
                title={title}
                onClose={fileSaveQueryAbortCloseCallback}
                onUserInteraction={resetTimeOut}
            />
            <AppMenuToolbar //
                entry={entry ?? undefined}
                saveFileClick={saveFileCallback}
                saveFileAsClick={saveFileAsCallback}
                loadFileClick={loadFileCallback}
                editClick={onEditClick}
                addClick={addItem}
                addCategoryClick={addCategoryClick}
                newFileClick={newClick}
                settingsClick={settingsClick}
                exitClick={exitClick}
                deleteClick={deleteClick}
                lockViewClick={lockViewClick}
                aboutShowClick={aboutShowClick}
            />
            <div //
                className={classNames(App.name, className)}
                onMouseDown={resetTimeOut}
                onMouseUp={resetTimeOut}
                onMouseMove={resetTimeOut}
                onKeyDown={resetTimeOut}
                onKeyUp={resetTimeOut}
            >
                <div id="mainView" className="App-itemsView">
                    <PasswordList //
                        treeListRef={treeListRef}
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
                {editEntry !== null && (
                    <EditEntryPopup //
                        entry={editEntry}
                        mode={entryEditMode}
                        visible={entryEditVisible}
                        onClose={onEditClose}
                    />
                )}
                {editEntry !== null && (
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
                <ConfirmPopup //
                    visible={dialogVisible}
                    mode={PopupType.Confirm}
                    message={deleteQueryMessage}
                    buttons={DialogButtons.Yes | DialogButtons.No}
                    onClose={deleteCategoryOrEntry}
                />
                {settingsRef.current && (
                    <PreferencesPopup //
                        visible={preferencesVisible}
                        settings={settingsRef.current}
                        onClose={preferencesClose}
                    />
                )}
                <AboutPopup //
                    visible={aboutVisible}
                    onClose={aboutClose}
                />
                <LockScreenOverlay //
                    lockText={lm("programLockedClickToUnlock")}
                    onClick={lockOverlayClick}
                    visible={viewLocked}
                />
                {lockPasswordQueryVisible && (
                    <QueryPasswordPopup //
                        showCloseButton={false}
                        verifyMode={false}
                        initialShowPassword={false}
                        onClose={queryUnlockPassword}
                        visible={lockPasswordQueryVisible}
                        disableCloseViaKeyboard={true}
                    />
                )}
            </div>
        </>
    );
};

const collapseTree = (tree: dxTreeList | undefined) => {
    if (tree) {
        tree.forEachNode((f: Node<DataEntry>) => {
            if (f.data?.parentId === -1) {
                tree.collapseRow(f.key);
            }
        });
    }
};

export default styled(App)`
    height: 100%;
    width: 100%;
    display: contents;    
    .App-itemsView {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction row;
        min-height: 0px;
    }
    .App-PasswordEntryEditor {
        width: 60%;
        margin: 10px;
    }
    .App-itemsView-list {
        width: 40%;
    }    
`;
