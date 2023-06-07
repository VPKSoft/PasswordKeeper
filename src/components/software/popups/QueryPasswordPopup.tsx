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
import { Button, Popup } from "devextreme-react";
import styled from "styled-components";
import classNames from "classnames";
import { KeyDownEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import { InitializedEvent } from "devextreme/ui/popup";
import { useLocalize } from "../../../i18n";
import PasswordTextbox from "../../reusable/inputs/PasswordTextbox";
import { useFocus } from "../../../hooks/UseFocus";

type Props = {
    className?: string;
    visible: boolean;
    verifyMode?: boolean;
    initialShowPassword?: boolean;
    showCloseButton?: boolean;
    disableCloseViaKeyboard?: boolean;
    onClose: (userAccepted: boolean, password?: string) => void;
};

const QueryPasswordPopup = ({
    className, //
    visible,
    verifyMode = false,
    initialShowPassword,
    showCloseButton,
    disableCloseViaKeyboard = false,
    onClose,
}: Props) => {
    const [userAccepted, setUserAccepted] = React.useState(false);
    const [password1, setPassword1] = React.useState("");
    const [password2, setPassword2] = React.useState("");
    const [setFocus, textBoxInitialized] = useFocus();

    const le = useLocalize("entries");
    const lu = useLocalize("ui");
    const lc = useLocalize("common");

    const title = React.useMemo(() => lc("givePassword"), [lc]);

    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onClose(userAccepted, userAccepted ? password1 : undefined);
            }
            setUserAccepted(false);
        },
        [onClose, password1, userAccepted]
    );

    const onHiding = React.useCallback(() => {
        onClose(userAccepted, userAccepted ? password1 : undefined);
        setUserAccepted(false);
    }, [onClose, password1, userAccepted]);

    const onPassword1Changed = React.useCallback((e: ValueChangedEvent) => {
        setPassword1(e.value);
    }, []);

    const onPassword2Changed = React.useCallback((e: ValueChangedEvent) => {
        setPassword2(e.value);
    }, []);

    const allowAccept = React.useMemo(() => {
        if (verifyMode) {
            return password1 !== "" && password2 !== "" && password1 === password2;
        }

        return password1 !== "";
    }, [password1, password2, verifyMode]);

    // Listen to the text box key event to react to Escape and Return keys.
    const onKeyDown = React.useCallback(
        (e: KeyDownEvent) => {
            if (e.event?.key === "Escape") {
                if (!disableCloseViaKeyboard) {
                    setUserAccepted(false);
                    onClose(false);
                }
            } else if (e.event?.key === "Enter" && allowAccept) {
                setUserAccepted(true);
                onClose(true, password1);
            }
        },
        [allowAccept, disableCloseViaKeyboard, onClose, password1]
    );

    const onInitialized = React.useCallback(
        (e: InitializedEvent) => {
            if (disableCloseViaKeyboard) {
                e.component?.registerKeyHandler("escape", () => void 0);
            }
        },
        [disableCloseViaKeyboard]
    );

    return (
        <Popup //
            title={title}
            showCloseButton={showCloseButton ?? true}
            visible={visible}
            onHiding={onHiding}
            onVisibleChange={onVisibleChange}
            onInitialized={onInitialized}
            dragEnabled={true}
            resizeEnabled={true}
            height={verifyMode ? 240 : 200}
            width={600}
            showTitle={true}
            onShown={setFocus}
        >
            <div className={classNames(QueryPasswordPopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{le("password")}</div>
                            </td>
                            <td>
                                <div>
                                    <PasswordTextbox //
                                        value={password1}
                                        onValueChanged={onPassword1Changed}
                                        showGeneratePassword={false}
                                        showCopyButton={true}
                                        initialShowPassword={initialShowPassword}
                                        onKeyDown={onKeyDown}
                                        onInitialized={textBoxInitialized}
                                    />
                                </div>
                            </td>
                        </tr>
                        {verifyMode && (
                            <tr>
                                <td>
                                    <div className="dx-field-item-label-text">{lc("retypePassword")}</div>
                                </td>
                                <td>
                                    <div>
                                        <PasswordTextbox //
                                            value={password2}
                                            onValueChanged={onPassword2Changed}
                                            showGeneratePassword={false}
                                            showCopyButton={true}
                                            initialShowPassword={initialShowPassword}
                                            onKeyDown={onKeyDown}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="Popup-ButtonRow">
                    <Button //
                        text={lu("ok")}
                        onClick={() => {
                            setUserAccepted(true);
                            onClose(true, password1);
                        }}
                        disabled={!allowAccept}
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

export default styled(QueryPasswordPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
    .Popup-entryEditor {
        height: 100%;
    }
    .Popup-ButtonRow {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: flex-end;
    }
`;
