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
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { ask } from "@tauri-apps/plugin-dialog";
import { exit } from "@tauri-apps/plugin-process";
import { open } from "@tauri-apps/plugin-shell";
import classNames from "classnames";
import { styled } from "styled-components";
import { StateFlags, restoreStateCurrent, saveWindowState } from "tauri-plugin-window-state";
import { setLocale, useLocalize } from "./I18n";
import type { CommonProps } from "./components/Types";
import { StyledAppMenuToolbar } from "./components/app/AppMenuToolbar";
import { StyledTitle } from "./components/app/WindowTitle";
import { StyledLockScreenOverlay } from "./components/reusable/LockScreenOverlay";
import { useNotify } from "./components/reusable/Notify";
import { StyledPasswordList } from "./components/reusable/PasswordList";
import { SearchMode, type SearchTextBoxValue } from "./components/reusable/inputs/SearchTextBox";
import { StyledEntryEditor } from "./components/software/EntryEditor";
import { StyledAboutPopup } from "./components/software/popups/AboutPopup";
import { StyledConfirmPopup } from "./components/software/popups/ConfirmPopup";
import { StyledEditEntryPopup } from "./components/software/popups/EditEntryPopup";
import { FilePreferencesPopupStyled } from "./components/software/popups/FilePreferencesPopup";
import { StyledOpenSaveFilePopup } from "./components/software/popups/OpenSaveFilePopup";
import { StyledPreferencesPopup } from "./components/software/popups/PreferencesPopup";
import { StyledQueryPasswordPopup } from "./components/software/popups/QueryPasswordPopup";
import { useAntdTheme, useAntdToken } from "./context/AntdThemeContext";
import { useCaptureClipboardCopy } from "./hooks/UseCaptureClipboardCopy";
import { useSecureStorage } from "./hooks/UseSecureStorage";
import { TimeInterval, useTimeout } from "./hooks/UseTimeout";
import { deleteEntryOrCategory, generalId, newEntry, updateDataSource } from "./misc/DataUtils";
import { DialogButtons, DialogResult, FileQueryMode, ModifyType, PopupType } from "./types/Enums";
import type { DataEntry, FileData, FileOptions, GeneralEntry } from "./types/PasswordEntry";
import { generateTags, loadFile, saveFile } from "./utilities/app/Files";
import { type Settings, useSettings } from "./utilities/app/Settings";
const appWindow = getCurrentWebviewWindow();

/**
 * The props for the {@link App} component.
 */
type AppProps = CommonProps;

/**
 * The application main component.
 * @param param0 The component props: {@link AppProps}.
 * @returns A component.
 */
const App = ({ className }: AppProps) => {
    // The i18next localization hooks.
    const la = useLocalize("app");
    const lm = useLocalize("messages");

    const { token } = useAntdToken();

    const [contextHolder, notification] = useNotify();

    const [entry, setEntry] = React.useState<DataEntry | null>(null);
    const [editEntry, setEditEntry] = React.useState<DataEntry | null>(null);
    const [entryEditVisible, setEntryEditVisible] = React.useState(false);
    const [filePreferencesVisible, setFilePreferencesVisible] = React.useState(false);

    const [dataSource, setDataSource] = React.useState<Array<DataEntry>>([]);
    const [dataTags, setDataTags] = React.useState<GeneralEntry<string>>({ type: "tags", values: [] });
    const [currentFile, setCurrentFile] = React.useState(la("newFileName"));
    const [fileChanged, setFileChanged] = React.useState(false);
    const [fileSaveOpenQueryOpen, setFileSaveOpenQueryOpen] = React.useState(false);
    const [filePopupMode, setFilePopupMode] = React.useState<FileQueryMode>(FileQueryMode.Open);
    const [entryEditMode, setEntryEditMode] = React.useState<ModifyType>(ModifyType.New);
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [preferencesVisible, setPreferencesVisible] = React.useState(false);
    const [aboutVisible, setAboutVisible] = React.useState(false);
    const [viewLocked, setViewLocked] = React.useState(false);
    const [lockPasswordQueryVisible, setLockPasswordQueryVisible] = React.useState(false);
    const [timeOut, setTimeOut] = React.useState(10);
    const [passwordFailedCount, setPasswordFailedCount] = React.useState(0);
    const [saveChangedFileQueryVisible, setSaveChangedFileQueryVisible] = React.useState(false);
    const [fileCloseRequested, setFileCloseRequested] = React.useState(false);
    const [isNewFile, setIsNewFile] = React.useState(true);
    const [searchTextBoxValue, setSearchTextBoxValue] = React.useState<SearchTextBoxValue>(searchBoxValueEmpty);
    const [fileOptions, setFileOptions] = React.useState<FileOptions>();
    const [expandedKeys, setExpandedKeys] = React.useState<Array<string>>([]);
    const [lastAddedDeletedId, setLastAddedDeletedId] = React.useState(0);
    const [previewDarkMode, setPreviewDarkMode] = React.useState<boolean | null>(null);
    const [listHeight, setListHeight] = React.useState<number | undefined>();

    const { setTheme, updateBackround } = useAntdTheme();
    const [settings, settingsLoaded, updateSettings, reloadSettings] = useSettings();

    const expandedKeysRef = React.useRef<Array<string>>([]);
    const selectedItemRef = React.useRef<DataEntry | null>(null);

    // Securely store the file password (to be able to save the file without querying the password) to the application local storage.
    const [setFilePassword, getFilePassword, clearFilePassword] = useSecureStorage<string>("filePassword", "");

    // Reset clipboard functionality.
    const [clipboardValue, resetClipboard] = useCaptureClipboardCopy();

    // Clear the clipboard when the 15 seconds has elapsed.
    const clearClipboard = React.useCallback(() => {
        void invoke("clear_clipboard", { currentSupposedValue: clipboardValue }).then(() => {
            resetClipboard();
        });
    }, [clipboardValue, resetClipboard]);

    // Have the useTimeout hook raise a callback if the 15 seconds has elapsed to clear the clipboard.
    const [clipboardTimeOut, resetClipboardTimeOut] = useTimeout(15, clearClipboard, TimeInterval.Seconds);

    // The clipboard value changed. Reset the useTimeout hook and set it enabled or disabled
    // based on the clipboard value.
    React.useEffect(() => {
        resetClipboardTimeOut();
        clipboardTimeOut(clipboardValue !== "");
    }, [clipboardTimeOut, clipboardValue, resetClipboardTimeOut]);

    // A call back to lock the main window and close the popups if any.
    const lockView = React.useCallback(() => {
        setViewLocked(true);
        // Hide the entry editor to hide sensitive data.
        setEditEntry(null);
        setEntry(null);

        // Reset the search box.
        setSearchTextBoxValue(searchBoxValueEmpty);

        // Hide the dialogs.
        setFileSaveOpenQueryOpen(false);
        setDialogVisible(false);
        setAboutVisible(false);
        setLockPasswordQueryVisible(false);
        setPreferencesVisible(false);

        // Collapse the tree. The categories are allowed to show.
        expandedKeysRef.current = expandedKeys;
        selectedItemRef.current = entry;
        setExpandedKeys([]);
    }, [entry, expandedKeys]);

    // A callback to lock the view after a time interval has elapsed.
    const onViewLockTimeout = React.useCallback(() => {
        lockView();
    }, [lockView]);

    const [setTimeoutEnabled, resetTimeOut] = useTimeout(timeOut, onViewLockTimeout, TimeInterval.Minutes);

    React.useEffect(() => {
        if (settings && setTheme) {
            void setLocale(settings.locale);
            setTheme(settings.dark_mode ? "dark" : "light");
            setTimeOut(settings.lock_timeout);
            setTimeoutEnabled(settings.lock_timeout > 0);
        }
    }, [setTheme, setTimeoutEnabled, settings]);

    // The file was requested to be closed. If the file has changes display a query popup
    // for to select the action what to do with the changes, otherwise just reload the view.
    const closeFile = React.useCallback(() => {
        setFileCloseRequested(true);
        if (fileChanged) {
            setSaveChangedFileQueryVisible(true);
            return;
        }

        clearFilePassword();
        // Reloading the window will do the same as re-setting multiple state variables.
        globalThis.location.reload();
    }, [clearFilePassword, fileChanged]);

    // Enable the time out hook if the view was unlocked.
    React.useEffect(() => {
        if (settings && !viewLocked) {
            setTimeoutEnabled(settings.lock_timeout > 0);
        }
    }, [setTimeoutEnabled, viewLocked, settings]);

    // Save the file "as new".
    const saveFileAsCallback = React.useCallback(() => {
        setFilePopupMode(FileQueryMode.SaveAs);
        setFileSaveOpenQueryOpen(true);
    }, []);

    // A file save was requested. Either save the file as new or override existing file.
    const saveFileCallback = React.useCallback(async () => {
        if (isNewFile) {
            // The file is a new one. It must be saved as.
            saveFileAsCallback();
        } else {
            // Retrieve the file password from the secure store so the file can be saved.
            const password = getFilePassword();
            if (currentFile && password) {
                // Save the file with the current file name and the current password.
                const data: FileData = {
                    entries: dataSource,
                    metaData: [dataTags],
                    dataOptions: fileOptions,
                    version: 1,
                };

                void saveFile(data, password, currentFile).then(f => {
                    if (f.ok) {
                        setCurrentFile(f.fileName);
                        setFileChanged(false);
                        if (fileCloseRequested) {
                            // File was requested to be closed after saving,
                            // reloading the window will do the same as re-setting multiple state variables.
                            globalThis.location.reload();
                        }
                    } else {
                        // Something went wrong with the file save. Display the error message.
                        notification("error", lm("fileSaveFail", undefined, f.errorMessage), 5);
                    }
                });
            }
        }
    }, [
        currentFile,
        dataSource,
        dataTags,
        fileCloseRequested,
        fileOptions,
        getFilePassword,
        isNewFile,
        lm,
        notification,
        saveFileAsCallback,
    ]);

    // A callback to query the user wether to save the file before the application is closed.
    const fileSaveQueryAbortCloseCallback = React.useCallback(async () => {
        if (fileChanged) {
            let result = false;
            const dialogResult = await ask(lm("fileChangedSaveQuery", undefined, { file: currentFile }), {
                title: lm("fileChangedTitle"),
            });
            if (dialogResult) {
                void saveFileCallback();
                result = true; // True for abort close
            } else {
                // Save the window state.
                if (settings?.save_window_state === true) {
                    await saveWindowState(StateFlags.ALL);
                }
            }

            return result;
        } else {
            // Save the window state.
            if (settings?.save_window_state === true) {
                await saveWindowState(StateFlags.ALL);
            }
            return false;
        }
    }, [currentFile, fileChanged, lm, saveFileCallback, settings]);

    // Open an existing file. E.g. set the file open popup to visible.
    const loadFileCallback = React.useCallback(() => {
        setFilePopupMode(FileQueryMode.Open);
        setFileSaveOpenQueryOpen(true);
    }, []);

    // Use an effect to listen the Tauri application close request.
    React.useEffect(() => {
        const unlisten = appWindow.onCloseRequested(async event => {
            const confirmed = await fileSaveQueryAbortCloseCallback();
            if (confirmed) {
                // User did not confirm closing the window; let's prevent it.
                event.preventDefault();
            }
        });

        // Stop the event listening.
        return () => {
            void unlisten.then(f => f());
        };
    }, [fileSaveQueryAbortCloseCallback]);

    // The entry editor popup was closed. Handle the possible changes.
    const onEditClose = React.useCallback(
        (userAccepted: boolean, entry?: DataEntry | undefined) => {
            // If the popup was accepted and there is something set in the entry...
            if (userAccepted && entry) {
                // ...update the data source and re-set the state variables.
                const newDataSource = updateDataSource(dataSource, entry);
                setDataSource(newDataSource);
                const newTags = generateTags(newDataSource);
                setDataTags(f => ({ ...f, values: newTags }));
                setEntry(entry);
                setLastAddedDeletedId(entry.id);
                setEditEntry(null);
                setFileChanged(true);
            }
            // Hide the popup.
            setEntryEditVisible(false);
        },
        [dataSource]
    );

    // The user requested to edit a selected entry or category. Set the editor visible.
    const onEditClick = React.useCallback(() => {
        if (entry) {
            setEditEntry({ ...entry });
            setEntryEditMode(ModifyType.Edit);
            setEntryEditVisible(true);
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
        if ((settings?.failed_unlock_attempts ?? 0) === 0) {
            return;
        }

        const failed = passwordFailedCount + 1;
        setPasswordFailedCount(failed);
        const lockAfter = (settings?.failed_unlock_attempts ?? 0) - failed;
        if (lockAfter > 0) {
            // Notify about the erroneous password.
            notification("warning", lm("passwordFailLockWarning", undefined, { lockAfter: lockAfter }), 5);
        } else {
            // The count exceeded, exit the software.
            void exit(0);
        }
    }, [lm, notification, passwordFailedCount, settings]);

    // The file popup was closed. If the user accepted the popup.
    // Depending on the popup mode and user input either open an existing file or save new file.
    const filePopupClose = React.useCallback(
        (userAccepted: boolean, fileName?: string, password?: string) => {
            if (userAccepted === true && fileName !== undefined && password !== undefined) {
                // The file mode is open, so open the file.
                if (filePopupMode === FileQueryMode.Open) {
                    void loadFile(password, fileName).then(f => {
                        if (f.ok) {
                            // Set the state data from the successfully loaded file.
                            setFilePassword(password);
                            setDataSource(f.fileData);
                            setCurrentFile(fileName);
                            setFileChanged(false);
                            setIsNewFile(false);
                            setPasswordFailedCount(0);
                            setDataTags(f.tags);
                            setFileOptions(f.dataOptions);
                            expandedKeysRef.current = [];
                            selectedItemRef.current = null;
                            setExpandedKeys([]);
                        } else {
                            // The file load failed with most probable reason being an invalid password.
                            notification("error", lm("fileOpenFail", undefined, { msg: f.errorMessage }), 5);
                            // Increase the failed password count, whatever the failure reason is.
                            increaseFileLockFail();
                        }
                    });
                    // The file mode is save as, so save the file.
                } else if (filePopupMode === FileQueryMode.SaveAs) {
                    const data: FileData = {
                        entries: dataSource,
                        metaData: [dataTags],
                        version: 1,
                    };
                    void saveFile(data, password, fileName).then(f => {
                        if (f.ok) {
                            // Set the state data for the successfully saved file.
                            setFilePassword(password);
                            setCurrentFile(fileName);
                            setIsNewFile(false);
                            setFileChanged(false);

                            if (fileCloseRequested) {
                                // File was requested to be closed after saving,
                                // reloading the window will do the same as re-setting multiple state variables.
                                globalThis.location.reload();
                            }
                        } else {
                            // Some error occurred saving the file, report the save failure.
                            notification("error", lm("fileSaveFail", undefined, { msg: f.errorMessage }), 5);
                        }
                    });
                }
            }
            setFileSaveOpenQueryOpen(false);
        },
        [
            dataSource,
            dataTags,
            fileCloseRequested,
            filePopupMode,
            increaseFileLockFail,
            lm,
            notification,
            setFilePassword,
        ]
    );

    // The exit application menu was chosen.
    const exitClick = React.useCallback(() => {
        // First make sure the application exit doesn't discard any changes that were wished to be saved.
        void fileSaveQueryAbortCloseCallback().then(result => {
            if (!result) {
                // If the exit is authorized or there are no changes to the current file,
                // exit the application.
                void exit(0);
            }
        });
    }, [fileSaveQueryAbortCloseCallback]);

    // The delete item was selected either for a category or an entry.
    const deleteClick = React.useCallback(() => {
        // Display the delete verification popup.
        if (entry?.id !== generalId) {
            setDialogVisible(true);
        }
    }, [entry?.id]);

    // The preferences was selected.
    const settingsClick = React.useCallback(() => {
        // Display the preferences popup.
        setPreferencesVisible(true);
    }, []);

    // Create a new file. This is exactly same as closing an existing one.
    const newClick = React.useCallback(() => {
        closeFile();
    }, [closeFile]);

    // An entry was selected to be added. Set the editing type to new and
    // set the edit entry popup visible.
    const addItem = React.useCallback(() => {
        setEntryEditMode(ModifyType.New);
        const parentId = entry && entry.parentId === -1 ? entry.id : generalId;
        const editEntry = newEntry(parentId, dataSource, "");
        setEditEntry(editEntry);
        setEntryEditVisible(true);
    }, [dataSource, entry]);

    // Memoize the delete query message based on the selected entry.
    const deleteQueryMessage = React.useMemo(() => {
        const message =
            entry?.parentId === -1
                ? lm("queryDeleteTag", undefined, { tag: entry?.name })
                : lm("queryDeleteEntry", undefined, { entry: entry?.name });
        return message;
    }, [entry, lm]);

    // A callback for the ConfirmPopup after querying about deleting a selected category or entry.
    const deleteEntry = React.useCallback(
        (e: DialogResult) => {
            // If the popup was accepted, delete the selected category or entry.
            if (e === DialogResult.Yes && entry) {
                const newDataSource = deleteEntryOrCategory(dataSource, entry);
                setDataSource(newDataSource);
                setFileChanged(true);
                const newTags = generateTags(newDataSource);
                setDataTags(f => ({ ...f, values: newTags }));
            }
            // Hide the ConfirmPopup.
            setDialogVisible(false);

            setEntry(null);
        },
        [dataSource, entry]
    );

    // A callback for the ConfirmPopup after querying whether to save changes to the
    // current file before closing it.
    const queryFileChangesPopupClosed = React.useCallback(
        (e: DialogResult) => {
            setSaveChangedFileQueryVisible(false);
            if (e === DialogResult.Yes) {
                void saveFileCallback();
            } else if (e === DialogResult.Cancel) {
                setSaveChangedFileQueryVisible(false);
                setFileCloseRequested(false);
            } else {
                // Reloading the window will do the same as re-setting multiple state variables.
                globalThis.location.reload();
            }
        },
        [saveFileCallback]
    );

    // Display the about popup.
    const aboutShowClick = React.useCallback(() => {
        setAboutVisible(true);
    }, []);

    // Close the about popup.
    const aboutClose = React.useCallback(() => {
        setAboutVisible(false);
    }, []);

    // Expands the tree list selection and restores the selected state upon unlocking the view.
    const expandTreeListSelection = React.useCallback(() => {
        setExpandedKeys(expandedKeysRef.current);
        setEntry(selectedItemRef.current);
    }, []);

    // A callback to unlock the view locked with an overlay.
    // If an existing file is opened a password dialog is displayed instead to unlock the view.
    const lockOverlayClick = React.useCallback(() => {
        if (isNewFile) {
            setViewLocked(false);
            void expandTreeListSelection();
        } else {
            setLockPasswordQueryVisible(true);
            setViewLocked(false);
        }
    }, [expandTreeListSelection, isNewFile]);

    // Locks the view via user interaction.
    const lockViewClick = React.useCallback(() => {
        lockView();
    }, [lockView]);

    // Open the Help from github.io to an external browser.
    const onHelpClick = React.useCallback(() => {
        void open("https://vpksoft.github.io/PasswordKeeper/");
    }, []);

    // Handles the key down event for the document.
    const handleKeyDown = React.useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "F1") {
                onHelpClick();
                e.stopPropagation();
            }
        },
        [onHelpClick]
    );

    // Add key down event listener to the document.
    React.useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // A callback to try to unlock the view when a password protected file is opened.
    const queryUnlockPassword = React.useCallback(
        (userAccepted: boolean, password?: string) => {
            setLockPasswordQueryVisible(false);
            if (userAccepted) {
                // Validate the unlock password against the given password.
                if (password === getFilePassword()) {
                    // The password validation was successful, unlock the view.
                    setViewLocked(false);
                    void expandTreeListSelection();
                    setPasswordFailedCount(0);
                } else {
                    // The password validation failed, keep the view locked and update the
                    // invalid password counter.
                    increaseFileLockFail();
                    setViewLocked(true);
                }
            } else {
                // The popup querying the password was not accepted, keep the view locked.
                setViewLocked(true);
            }
        },
        [expandTreeListSelection, getFilePassword, increaseFileLockFail]
    );

    // Restore the window state when the settings have been loaded.
    React.useEffect(() => {
        if (settingsLoaded && settings?.save_window_state === true) {
            void restoreStateCurrent(StateFlags.ALL);
        }
    }, [settingsLoaded, settings]);

    // File options were changed. Apply the changes and set the file changed flag.
    const fileOptionsChanged = React.useCallback((userAccepted: boolean, fileOptions?: FileOptions) => {
        if (userAccepted && fileOptions) {
            setFileOptions(fileOptions);
            setFileChanged(true);
        }
        setFilePreferencesVisible(false);
    }, []);

    // The file preferences was requested to be modified.
    const filePreferencesClick = React.useCallback(() => {
        setFilePreferencesVisible(true);
    }, []);

    // This effect occurs when the theme token has been changed and updates the
    // root and body element colors to match to the new theme.
    React.useEffect(() => {
        updateBackround?.(token);
    }, [token, updateBackround]);

    const toggleDarkMode = React.useCallback(
        (antdTheme: "light" | "dark") => {
            setTheme?.(antdTheme);
            setPreviewDarkMode(antdTheme === "dark");
        },
        [setTheme]
    );

    const onPreferencesClose = React.useCallback(() => {
        setPreferencesVisible(false);
        void reloadSettings().then(() => {
            setPreviewDarkMode(null);
            setTheme?.(settings?.dark_mode ? "dark" : "light");
        });
    }, [reloadSettings, setTheme, settings?.dark_mode]);

    // A hack to keep the scrollbar outlook consistent with the theme.
    const onTreeResize = React.useCallback(() => {
        const myDiv = document.querySelectorAll(".App-itemsView-list")?.[0] as HTMLDivElement;
        setListHeight(myDiv.offsetHeight);
    }, []);

    React.useEffect(() => {
        globalThis.addEventListener("resize", onTreeResize);

        return () => globalThis.removeEventListener("resize", onTreeResize);
    }, [onTreeResize]);

    // Don't render the page if the settings have not been loaded yet.
    if (!settingsLoaded || settings === null) {
        return null;
    }

    // Render the main view.
    return (
        <>
            {contextHolder}
            <StyledTitle //
                title={title}
                onClose={fileSaveQueryAbortCloseCallback}
                onUserInteraction={resetTimeOut}
                darkMode={previewDarkMode ?? settings.dark_mode ?? false}
            />
            <StyledAppMenuToolbar //
                entry={entry ?? undefined}
                searchValue={searchTextBoxValue}
                searchValueChanged={setSearchTextBoxValue}
                saveFileClick={saveFileCallback}
                saveFileAsClick={saveFileAsCallback}
                loadFileClick={loadFileCallback}
                editClick={onEditClick}
                addClick={addItem}
                newFileClick={newClick}
                settingsClick={settingsClick}
                exitClick={exitClick}
                deleteClick={deleteClick}
                lockViewClick={lockViewClick}
                aboutShowClick={aboutShowClick}
                fileCloseClick={closeFile}
                onHelpClick={onHelpClick}
                filePreferencesClick={filePreferencesClick}
                isNewFile={isNewFile}
                isfileChanged={fileChanged}
                darkMode={previewDarkMode ?? settings.dark_mode ?? false}
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
                    <StyledPasswordList //
                        searchValue={searchTextBoxValue}
                        dataSource={dataSource}
                        className="App-itemsView-list"
                        setEntry={setEntry}
                        expandedKeys={expandedKeys}
                        setExpandedKeys={setExpandedKeys}
                        lastAddedDeletedId={lastAddedDeletedId}
                        setLastAddedDeletedId={setLastAddedDeletedId}
                        darkMode={previewDarkMode ?? settings.dark_mode ?? false}
                        height={listHeight}
                    />
                    <StyledEntryEditor //
                        className="App-PasswordEntryEditor"
                        entry={entry}
                        readOnly={true}
                        visible={entry?.parentId !== -1}
                        hidePasswordTimeout={10}
                        showCopyButton={true}
                        hideQrAuthPopup={true}
                        notesFont={fileOptions?.notesFont}
                        useHtmlOnNotes={fileOptions?.useHtmlOnNotes}
                        defaultUseMarkdown={fileOptions?.useMarkdownOnNotes}
                        defaultUseMonospacedFont={fileOptions?.useMonospacedFont}
                        locale={settings?.locale ?? "en"}
                        darkMode={previewDarkMode ?? settings.dark_mode ?? false}
                    />
                </div>
                <StyledEditEntryPopup //
                    entry={editEntry ?? undefined}
                    mode={entryEditMode}
                    visible={entryEditVisible}
                    onClose={onEditClose}
                    allTags={dataTags.values}
                    notesFont={fileOptions?.notesFont}
                    useHtmlOnNotes={fileOptions?.useHtmlOnNotes}
                    defaultUseMarkdown={fileOptions?.useMarkdownOnNotes}
                    defaultUseMonospacedFont={fileOptions?.useMonospacedFont}
                    locale={settings?.locale ?? "en"}
                    darkMode={previewDarkMode ?? settings.dark_mode ?? false}
                />
                <StyledOpenSaveFilePopup //
                    visible={fileSaveOpenQueryOpen}
                    onClose={filePopupClose}
                    mode={filePopupMode}
                    currentFile={currentFile}
                    darkMode={previewDarkMode ?? settings.dark_mode ?? false}
                />
                <StyledConfirmPopup //
                    visible={dialogVisible}
                    mode={PopupType.Confirm}
                    message={deleteQueryMessage}
                    buttons={DialogButtons.Yes | DialogButtons.No}
                    onClose={deleteEntry}
                    darkMode={previewDarkMode ?? settings.dark_mode ?? false}
                />
                <StyledConfirmPopup //
                    visible={saveChangedFileQueryVisible}
                    mode={PopupType.Confirm}
                    message={lm("fileChangedSaveQuery", undefined, { file: currentFile })}
                    buttons={DialogButtons.Yes | DialogButtons.No | DialogButtons.Cancel}
                    onClose={queryFileChangesPopupClosed}
                    darkMode={previewDarkMode ?? settings.dark_mode ?? false}
                />
                {settings && (
                    <StyledPreferencesPopup //
                        visible={preferencesVisible}
                        settings={settings}
                        onClose={onPreferencesClose}
                        toggleDarkMode={toggleDarkMode}
                        updateSettings={updateSettings}
                    />
                )}
                <StyledAboutPopup //
                    visible={aboutVisible}
                    onClose={aboutClose}
                    textColor="white"
                    darkMode={previewDarkMode ?? settings.dark_mode ?? false}
                />
                <StyledLockScreenOverlay //
                    lockText={lm("programLockedClickToUnlock")}
                    onClick={lockOverlayClick}
                    visible={viewLocked}
                    backgroundColor={settings?.dark_mode ? "#000000" : "#ffffff"}
                    foreColor={settings?.dark_mode ? "#FFFFFF" : "#000000"}
                    backgroundOpacity={1}
                />
                {lockPasswordQueryVisible && (
                    <StyledQueryPasswordPopup //
                        showCloseButton={false}
                        verifyMode={false}
                        initialShowPassword={false}
                        onClose={queryUnlockPassword}
                        visible={lockPasswordQueryVisible}
                        disableCloseViaKeyboard={true}
                        darkMode={previewDarkMode ?? settings.dark_mode ?? false}
                    />
                )}
                <FilePreferencesPopupStyled //
                    visible={filePreferencesVisible}
                    fileOptions={fileOptions}
                    onClose={fileOptionsChanged}
                    darkMode={previewDarkMode ?? settings.dark_mode ?? false}
                />
            </div>
        </>
    );
};

const searchBoxValueEmpty: SearchTextBoxValue = { value: "", searchMode: SearchMode.Or };

const StyledApp = styled(App)`
    height: 100%;
    width: 100%;
    display: contents;    
        .AppMenu {
        overflow: hidden;
    }
    .App-itemsView {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction row;
        min-height: 0px;
    }
    .App-PasswordEntryEditor {
        width: 60%;
        margin-left: 6px;
        min-height: 0px;
    }
    .App-itemsView-list {
        width: 40%;
        overflow: auto;
    }    
`;

export { StyledApp };
