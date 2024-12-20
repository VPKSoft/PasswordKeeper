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

import { Button, Checkbox, InputNumber, Modal, Select } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import classNames from "classnames";
import * as React from "react";
import { styled } from "styled-components";
import { type Locales, currentLocales, useLocalize } from "../../../I18n";
import type { Settings } from "../../../utilities/app/Settings";
import type { CommonProps } from "../../Types";

/**
 * The props for the {@link PreferencesPopup} component.
 */
type PreferencesPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** The current program settings. */
    settings: Settings;
    /** A call back to toggle the dark mode. */
    toggleDarkMode: (antdTheme: "light" | "dark") => void;
    /** A call back to update the settings. */
    updateSettings: (settings: Settings) => Promise<void>;
    /** A call back to close the popup. */
    onClose: () => void;
} & CommonProps;

/**
 * A component to set the application preferences.
 * @param param0 The component props: {@link PreferencesPopupProps}.
 * @returns A component.
 */
const PreferencesPopup = ({
    className, //
    visible,
    settings,
    toggleDarkMode,
    updateSettings,
    onClose,
}: PreferencesPopupProps) => {
    const [settingsInternal, setSettingsInternal] = React.useState<Settings>(settings);

    // Store the settings passed via the prop to the internal state of the component.
    React.useEffect(() => {
        setSettingsInternal(settings);
    }, [settings]);

    const lu = useLocalize("ui");
    const ls = useLocalize("settings");
    const lc = useLocalize("common");

    // Memoize the popup title.
    const title = React.useMemo(() => ls("settings"), [ls]);

    const setDarkMode = React.useCallback(
        (e: CheckboxChangeEvent) => {
            toggleDarkMode(e.target.checked === true ? "dark" : "light");
            setSettingsInternal({ ...settingsInternal, dark_mode: e.target.checked === true });
        },
        [settingsInternal, toggleDarkMode]
    );

    // Save the locale Lookup value into the internal state.
    const onLocaleValueChanged = React.useCallback(
        (value: string) => {
            const valueNew = value as Locales;
            setSettingsInternal({ ...(settingsInternal ?? settings), locale: valueNew });
        },
        [settings, settingsInternal]
    );

    // Save the changed lock timeout NumberBox value into the internal state.
    const setLockTimeout = React.useCallback(
        (value: number | null) => {
            if (value) {
                setSettingsInternal({ ...(settingsInternal ?? settings), lock_timeout: value });
            }
        },
        [settings, settingsInternal]
    );

    // Save the password retry count NumberBox value into the internal state.
    const setFailedUnlockCount = React.useCallback(
        (value: number | null) => {
            if (value) {
                setSettingsInternal({ ...(settingsInternal ?? settings), failed_unlock_attempts: value });
            }
        },
        [settings, settingsInternal]
    );

    const setSaveWindowState = React.useCallback(
        (e: CheckboxChangeEvent) => {
            setSettingsInternal({ ...(settingsInternal ?? settings), save_window_state: e.target.checked === true });
        },
        [settings, settingsInternal]
    );

    // The OK button was clicked.
    const onOkClick = React.useCallback(() => {
        const updatedSettings = { ...settingsInternal };
        updatedSettings.error ??= false;
        updatedSettings.error_message ??= "";

        void updateSettings(updatedSettings).then(() => {
            onClose();
        });
    }, [onClose, settingsInternal, updateSettings]);

    // The Cancel button was clicked.
    const onCancelClick = React.useCallback(() => {
        onClose();
    }, [onClose]);

    return (
        <Modal //
            title={title}
            open={visible}
            width={600}
            centered
            onCancel={onCancelClick}
            keyboard
            footer={null}
        >
            <div className={classNames(PreferencesPopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div>{lc("language")}</div>
                            </td>
                            <td>
                                <Select //
                                    className="Select-width"
                                    options={currentLocales}
                                    fieldNames={{ label: "name", value: "code" }}
                                    onChange={onLocaleValueChanged}
                                    value={settingsInternal?.locale}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>{ls("lockTimeoutMinutes")}</div>
                            </td>
                            <td>
                                <InputNumber //
                                    value={settingsInternal?.lock_timeout}
                                    min={0}
                                    max={120}
                                    onChange={setLockTimeout}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>{ls("failedUnlockExitCount")}</div>
                            </td>
                            <td>
                                <InputNumber //
                                    value={settingsInternal?.failed_unlock_attempts}
                                    min={0}
                                    max={20}
                                    onChange={setFailedUnlockCount}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div>{ls("saveWindowPosition")}</div>
                            </td>
                            <td>
                                <Checkbox //
                                    checked={settingsInternal?.save_window_state}
                                    onChange={setSaveWindowState}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>{ls("darkMode")}</div>
                            </td>
                            <td>
                                <Checkbox //
                                    checked={settingsInternal.dark_mode}
                                    onChange={setDarkMode}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="Popup-ButtonRow">
                    <Button //
                        onClick={onOkClick}
                    >
                        {lu("ok")}
                    </Button>
                    <Button //
                        onClick={onCancelClick}
                    >
                        {lu("cancel")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const StyledPreferencesPopup = styled(PreferencesPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
    .Popup-content {
        height: 100%;
    }
    .Popup-ButtonRow {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: flex-end;
    }
    .Select-width {
        width: 300px;
    }
`;

export { StyledPreferencesPopup };
