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
import { Button, Lookup, NumberBox, Popup } from "devextreme-react";
import classNames from "classnames";
import { ValueChangedEvent } from "devextreme/ui/lookup";
import { styled } from "styled-components";
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
    const [userAccepted, setUserAccepted] = React.useState(false);
    const [settingsInternal, setSettingsInternal] = React.useState<Settings>();

    // Store the settings passed via the prop to the internal state of the component.
    React.useEffect(() => {
        setSettingsInternal(settings);
    }, [settings]);

    const lu = useLocalize("ui");
    const ls = useLocalize("settings");
    const lc = useLocalize("common");

    // Memoize the DevExtreme themes as a data source used by a theme Lookup.
    const dataSource = React.useMemo(() => {
        const result = dxThemes.map(f => ({ key: f, name: f.replaceAll(".", " ").replaceAll(/(^\w|\s\w)/g, m => m.toUpperCase()) }));
        return result;
    }, []);

    // Memoize the popup title.
    const title = React.useMemo(() => ls("settings"), [ls]);

    // Handle the onVisibleChange callback of the Popup component.
    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onClose(userAccepted);
            }
            setUserAccepted(false);
        },
        [onClose, userAccepted]
    );

    // Handle the onHiding callback of the Popup component.
    const onHiding = React.useCallback(() => {
        onClose(userAccepted);
        setUserAccepted(false);
    }, [onClose, userAccepted]);

    // Save the changed theme Lookup value into the internal state.
    const onThemeValueChanged = React.useCallback(
        (e: ValueChangedEvent) => {
            const value = e.value as DxThemeNames;
            setSettingsInternal({ ...settings, dx_theme: value });
        },
        [settings]
    );

    // Save the locale Lookup value into the internal state.
    const onLocaleValueChanged = React.useCallback(
        (e: ValueChangedEvent) => {
            const value = e.value as Locales;
            setSettingsInternal({ ...settings, locale: value });
        },
        [settings]
    );

    // Save the changed lock timeout NumberBox value into the internal state.
    const setLockTimeout = React.useCallback(
        (value: number) => {
            setSettingsInternal({ ...settings, lock_timeout: value });
        },
        [settings]
    );

    // Save the password retry count NumberBox value into the internal state.
    const setFailedUnlockCount = React.useCallback(
        (value: number) => {
            setSettingsInternal({ ...settings, failed_unlock_attempts: value });
        },
        [settings]
    );

    return (
        <Popup //
            title={title}
            showCloseButton={true}
            visible={visible}
            onHiding={onHiding}
            onVisibleChange={onVisibleChange}
            dragEnabled={true}
            resizeEnabled={true}
            height={320}
            width={600}
            showTitle={true}
        >
            <div className={classNames(PreferencesPopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{ls("theme")}</div>
                            </td>
                            <td>
                                <Lookup //
                                    dataSource={dataSource}
                                    displayExpr="name"
                                    valueExpr="key"
                                    value={settingsInternal?.dx_theme}
                                    onValueChanged={onThemeValueChanged}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{lc("language")}</div>
                            </td>
                            <td>
                                <Lookup //
                                    dataSource={currentLocales}
                                    displayExpr="name"
                                    valueExpr="code"
                                    value={settingsInternal?.locale}
                                    onValueChanged={onLocaleValueChanged}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{ls("lockTimeoutMinutes")}</div>
                            </td>
                            <td>
                                <NumberBox //
                                    value={settings.lock_timeout}
                                    min={0}
                                    max={120}
                                    onValueChange={setLockTimeout}
                                    showSpinButtons={true}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{ls("failedUnlockExitCount")}</div>
                            </td>
                            <td>
                                <NumberBox //
                                    value={settings.failed_unlock_attempts}
                                    min={0}
                                    max={20}
                                    onValueChange={setFailedUnlockCount}
                                    showSpinButtons={true}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="Popup-ButtonRow">
                    <Button //
                        text={lu("ok")}
                        onClick={() => {
                            setUserAccepted(true);
                            onClose(true, settingsInternal);
                        }}
                    />
                    <Button //
                        text={lu("cancel")}
                        onClick={() => {
                            setUserAccepted(false);
                            onClose(false);
                        }}
                    />
                </div>
            </div>
        </Popup>
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
`;

export { StyledPreferencesPopup };
