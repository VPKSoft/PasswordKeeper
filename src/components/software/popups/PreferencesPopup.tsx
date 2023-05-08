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
import { Button, Lookup, Popup } from "devextreme-react";
import styled from "styled-components";
import classNames from "classnames";
import { ValueChangedEvent } from "devextreme/ui/lookup";
import { useLocalize } from "../../../i18n";
import { Settings } from "../../../types/Settings";
import { DxThemeNames, dxThemes } from "../../../utilities/ThemeUtils";

type Props = {
    className?: string;
    visible: boolean;
    settings: Settings;
    onClose: (userAccepted: boolean, settings?: Settings) => void;
};

const PreferencesPopup = ({
    className, //
    visible,
    settings,
    onClose,
}: Props) => {
    const [userAccepted, setUserAccepted] = React.useState(false);
    const [settingsInternal, setSettingsInternal] = React.useState<Settings>();

    React.useEffect(() => {
        setSettingsInternal(settings);
    }, [settings]);

    const lu = useLocalize("ui");
    const ls = useLocalize("settings");

    const dataSource = React.useMemo(() => {
        const result = dxThemes.map(f => ({ key: f, name: f.replaceAll(".", " ").replace(/(^\w|\s\w)/g, m => m.toUpperCase()) }));
        return result;
    }, []);

    const title = React.useMemo(() => ls("settings"), [ls]);

    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onClose(userAccepted);
            }
            setUserAccepted(false);
        },
        [onClose, userAccepted]
    );

    const onHiding = React.useCallback(() => {
        onClose(userAccepted);
        setUserAccepted(false);
    }, [onClose, userAccepted]);

    const onValueChanged = React.useCallback(
        (e: ValueChangedEvent) => {
            const value = e.value as DxThemeNames;
            setSettingsInternal({ ...settings, dx_theme: value });
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
            height={200}
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
                                <Lookup dataSource={dataSource} displayExpr="name" valueExpr="key" value={settingsInternal?.dx_theme} onValueChanged={onValueChanged} />
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

export default styled(PreferencesPopup)`
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
