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

import { Button, Checkbox, Input, InputNumber, Modal, Select } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import classNames from "classnames";
import * as React from "react";
import { styled } from "styled-components";
import { type Locales, currentLocales, useLocalize } from "../../../I18n";
import { validatePassword } from "../../../utilities/app/Passwords";
import type { ServerSettings, Settings } from "../../../utilities/app/Settings";
import type { CommonProps } from "../../Types";

/**
 * The props for the {@link PreferencesPopup} component.
 */
type ServerPreferencesPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** The current program server settings. */
    settings: ServerSettings;
    /** A call back to update the server settings. */
    updateSettings: (settings: ServerSettings) => Promise<void>;
    /** A call back to close the popup. */
    onClose: () => void;
} & CommonProps;

type AllowedInputIds = keyof ServerSettings;

const validateInputId = (id: AllowedInputIds): string => {
    return id;
};

/**
 * A component to set the application preferences.
 * @param param0 The component props: {@link ServerPreferencesPopupProps}.
 * @returns A component.
 */
let ServerPreferencesPopup = ({
    className, //
    visible,
    settings,
    updateSettings,
    onClose,
}: ServerPreferencesPopupProps) => {
    const [settingsInternal, setSettingsInternal] = React.useState<ServerSettings>(settings);

    // Store the settings passed via the prop to the internal state of the component.
    React.useEffect(() => {
        setSettingsInternal(settings);
    }, [settings]);

    const lu = useLocalize("ui");
    const ls = useLocalize("settings");
    const lc = useLocalize("common");

    // Memoize the popup title.
    const title = React.useMemo(() => ls("settings"), [ls]);

    const setSettingsInternalValue = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const key = e.target.id as keyof ServerSettings;
            setSettingsInternal(setServerSettingsValue(settingsInternal, key, e.target.value as keyof typeof key));
        },
        [settingsInternal]
    );

    const setPasswordFieldValue = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const key = e.target.id as keyof ServerSettings;
            if (!validatePassword(e.target.value)) {
            }
            setSettingsInternal(setServerSettingsValue(settingsInternal, key, e.target.value as keyof typeof key));
        },
        [settingsInternal]
    );

    // The OK button was clicked.
    const onOkClick = React.useCallback(() => {
        const updatedSettings = { ...settingsInternal };

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
            <div className={classNames(ServerPreferencesPopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div>{ls("serverAddress")}</div>
                            </td>
                            <td>
                                <Input //
                                    value={settingsInternal?.server_address}
                                    onChange={setSettingsInternalValue}
                                    id={validateInputId("server_address")}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>{ls("serverUserFullName")}</div>
                            </td>
                            <td>
                                <Input //
                                    value={settingsInternal?.server_address}
                                    onChange={setSettingsInternalValue}
                                    id={validateInputId("server_address")}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>{ls("serverPassword")}</div>
                            </td>
                            <td>
                                <Input //
                                    value={settingsInternal?.server_address}
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

const setServerSettingsValue = (serverSettings: ServerSettings, key: keyof ServerSettings, value: keyof typeof key) => {
    return { ...serverSettings, [key]: value };
};

ServerPreferencesPopup = styled(ServerPreferencesPopup)`
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

export { ServerPreferencesPopup };
