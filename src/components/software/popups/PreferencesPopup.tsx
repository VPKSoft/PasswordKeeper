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
import classNames from "classnames";
import { styled } from "styled-components";
import { Button, Checkbox, InputNumber, Modal, Select } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Locales, currentLocales, useLocalize } from "../../../i18n";
import { Settings } from "../../../types/Settings";
import { DxThemeNames, dxThemes } from "../../../utilities/ThemeUtils";
import { CommonProps } from "../../Types";

/**
 * The props for the {@link PreferencesPopup} component.
 */
type PreferencesPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** The current program settings. */
    settings: Settings;
    /**
     * A callback which occurs when the popup is closed.
     * @param {boolean} userAccepted A value indicating whether the user accepted the popup.
     * @param {Settings} settings The updated settings settings in case the popup was accepted.
     * @returns {void} void.
     */
    onClose: (userAccepted: boolean, settings?: Settings) => void;
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
    onClose,
}: PreferencesPopupProps) => {
    const [settingsInternal, setSettingsInternal] = React.useState<Settings>();

    // Store the settings passed via the prop to the internal state of the component.
    React.useEffect(() => {
        setSettingsInternal(settings);
    }, [settings]);

    const lu = useLocalize("ui");
    const ls = useLocalize("settings");
    const lc = useLocalize("common");

    // Memoize the themes as a data source used by a theme Lookup.
    const dataSource = React.useMemo(() => {
        const result = dxThemes.map(f => ({ key: f, name: f.replaceAll(".", " ").replaceAll(/(^\w|\s\w)/g, m => m.toUpperCase()) }));
        return result;
    }, []);

    // Memoize the popup title.
    const title = React.useMemo(() => ls("settings"), [ls]);

    // Save the changed theme Lookup value into the internal state.
    const onThemeValueChanged = React.useCallback(
        (value: { key: string; name: string }) => {
            const valueNew = value.key as DxThemeNames;
            setSettingsInternal({ ...(settingsInternal ?? settings), theme: valueNew });
        },
        [settings, settingsInternal]
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
        onClose(true, settingsInternal);
    }, [onClose, settingsInternal]);

    // The Cancel button was clicked.
    const onCancelClick = React.useCallback(() => {
        onClose(false);
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
                                <div className="dx-field-item-label-text">{ls("theme")}</div>
                            </td>
                            <td>
                                <Select //
                                    className="Select-width"
                                    options={dataSource}
                                    fieldNames={{ label: "name", value: "key" }}
                                    value={dataSource.find(f => f.key === settingsInternal?.theme)}
                                    onChange={onThemeValueChanged}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{lc("language")}</div>
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
                                <div className="dx-field-item-label-text">{ls("lockTimeoutMinutes")}</div>
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
                                <div className="dx-field-item-label-text">{ls("failedUnlockExitCount")}</div>
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
                                <div className="dx-field-item-label-text">{ls("saveWindowPosition")}</div>
                            </td>
                            <td>
                                <Checkbox //
                                    checked={settingsInternal?.save_window_state}
                                    onChange={setSaveWindowState}
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
