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

import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { exit } from "@tauri-apps/plugin-process";
import { Button, type InputRef, Modal } from "antd";
import classNames from "classnames";
import * as React from "react";
import { styled } from "styled-components";
import { useLocalize } from "../../../I18n";
import type { CommonProps } from "../../Types";
import { darkModeMenuBackground, lightModeMenuBackground } from "../../app/AntdConstants";
import { StyledPasswordTextBox } from "../../reusable/inputs/PasswordTextBox";

/**
 * The props for the {@link QueryPasswordPopup} component.
 */
type QueryPasswordPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** A value indicating whether the password input should be verified by using another password text box. */
    verifyMode?: boolean;
    /** A value indicating whether the password should be initially visible. */
    initialShowPassword?: boolean;
    /** A value indicating whether to display the {@link Popup} close ("X") button. */
    showCloseButton?: boolean;
    /** A value indicating whether closing the popup with not accepting the popup should be disabled. E.g. The Escape key. */
    disableCloseViaKeyboard?: boolean;
    /** A value indicating whether to use dark mode with the application. */
    darkMode: boolean;
    /**
     * A callback when the popup is closed.
     * @param {boolean} userAccepted A value indicating whether the user accepted the popup.
     * @param {string} password The password inputted by the user.
     * @returns {void} void.
     */
    onClose: (userAccepted: boolean, password?: string) => void;
} & CommonProps;

/**
 * A popup component to request password and optionally password verification from the user.
 * @param param0 The component props: {@link QueryPasswordPopupProps}.
 * @returns A component.
 */
const QueryPasswordPopup = ({
    className, //
    visible,
    verifyMode = false,
    initialShowPassword,
    showCloseButton,
    disableCloseViaKeyboard = false,
    onClose,
}: QueryPasswordPopupProps) => {
    const [password1, setPassword1] = React.useState("");
    const [password2, setPassword2] = React.useState("");

    const le = useLocalize("entries");
    const lu = useLocalize("ui");
    const lc = useLocalize("common");

    const inputRef = React.useRef<InputRef>(null);

    // Memoize the localized title.
    const title = React.useMemo(() => lc("givePassword"), [lc]);

    // Save the first password input value to the state when it is changed.
    const onPassword1Changed = React.useCallback((e: string) => {
        setPassword1(e);
    }, []);

    // Save the second password input value to the state when it is changed.
    const onPassword2Changed = React.useCallback((e: string) => {
        setPassword2(e);
    }, []);

    // Memoize the value whether the popup can be accepted. E.g. the password(s) are set.
    const allowAccept = React.useMemo(() => {
        if (verifyMode) {
            return password1 !== "" && password2 !== "" && password1 === password2;
        }

        return password1 !== "";
    }, [password1, password2, verifyMode]);

    // Listen to the text box key event to react to Escape and Return keys.
    const onKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Escape") {
                if (!disableCloseViaKeyboard) {
                    onClose(false);
                }
            } else if (e.key === "Enter" && allowAccept) {
                onClose(true, password1);
            }
        },
        [allowAccept, disableCloseViaKeyboard, onClose, password1]
    );

    // The OK button was clicked.
    const onOkClick = React.useCallback(() => {
        onClose(true, password1);
    }, [onClose, password1]);

    const forceCloseClick = React.useCallback(() => {
        void exit(0);
    }, []);

    // The Cancel button was clicked.
    const onCancelClick = React.useCallback(() => {
        onClose(false);
    }, [onClose]);

    // Set the focus to the text box.
    const afterOpenChange = React.useCallback((open: boolean) => {
        if (open) {
            inputRef.current?.focus();
        }
    }, []);

    return (
        <Modal //
            title={title}
            closeIcon={showCloseButton ?? true}
            open={visible}
            keyboard // Escape close
            width={600}
            centered
            footer={null}
            afterOpenChange={afterOpenChange}
        >
            <div className={classNames(QueryPasswordPopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div>{le("password")}</div>
                            </td>
                            <td>
                                <div>
                                    <StyledPasswordTextBox //
                                        value={password1}
                                        onValueChanged={onPassword1Changed}
                                        showGeneratePassword={false}
                                        showCopyButton={true}
                                        initialShowPassword={initialShowPassword}
                                        onKeyDown={onKeyDown}
                                        inputRef={inputRef}
                                    />
                                </div>
                            </td>
                        </tr>
                        {verifyMode && (
                            <tr>
                                <td>
                                    <div>{lc("retypePassword")}</div>
                                </td>
                                <td>
                                    <div>
                                        <StyledPasswordTextBox //
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
                        onClick={onOkClick}
                        disabled={!allowAccept}
                    >
                        {lu("ok")}
                    </Button>
                    <Button //
                        onClick={onCancelClick}
                    >
                        {lu("cancel")}
                    </Button>
                    <Button //
                        onClick={forceCloseClick}
                        icon={<FontAwesomeIcon icon={faTriangleExclamation} />}
                    >
                        {lu("close", "Close")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const StyledQueryPasswordPopup = styled(QueryPasswordPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: ${props => (props.darkMode ? darkModeMenuBackground : lightModeMenuBackground)};
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

export { StyledQueryPasswordPopup };
