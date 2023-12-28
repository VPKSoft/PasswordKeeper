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

import classNames from "classnames";
import * as React from "react";
import { styled } from "styled-components";
import { Button, Input, InputRef, Tooltip } from "antd";
import { faCopy, faEye, faEyeSlash, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocalize } from "../../../i18n";
import { CommonProps } from "../../Types";
import { clipboardNotifyOther } from "../../../hooks/UseCaptureClipboardCopy";
import { useNotify } from "../Notify";

/**
 * The props for the {@link PasswordTextBox} component.
 */
type PasswordTextBoxProps = {
    /** A value indicting if the text box is in readonly mode. */
    readonly?: boolean;
    /** The current value of the text box. */
    value?: string | undefined;
    /** A Value indicating a time interval in seconds to hide to password if it is visible. */
    hidePasswordTimeout?: number;
    /** A value indicating if to display the generate password button. */
    showGeneratePassword?: boolean;
    /** A value indicating whether to display the copy password to clipboard button. */
    showCopyButton?: boolean;
    /** An initial value to indicate whether the password should be visible as plain text. */
    initialShowPassword?: boolean;
    /** Occurs when the {@link TextBox} value has been changed. */
    onValueChanged?: (e: string) => void;
    /** Occurs when a key was pressed on the {@link TextBox}. */
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    /** A ref top the actual input element. */
    inputRef?: React.Ref<InputRef>;
} & CommonProps;

/**
 * A password input component with password generation possibility and copy to clipboard functionality.
 * @param param0 The component props: {@link PasswordTextBoxProps}.
 * @returns A component.
 */
const PasswordTextBox = ({
    readonly = false, //
    className,
    value,
    showGeneratePassword,
    hidePasswordTimeout,
    showCopyButton,
    initialShowPassword,
    inputRef,
    onValueChanged,
    onKeyDown,
}: PasswordTextBoxProps) => {
    const [displayPassword, setDisplayPassword] = React.useState(initialShowPassword ?? false);
    const [contextHolder, notification] = useNotify();
    const lu = useLocalize("ui");

    // If the password hiding is enabled, hide the password after a specified interval.
    React.useEffect(() => {
        if (hidePasswordTimeout && hidePasswordTimeout > 0 && displayPassword && readonly) {
            const timer = window.setInterval(() => {
                setDisplayPassword(false);
            }, hidePasswordTimeout * 1_000);

            return () => window.clearInterval(timer);
        }
    }, [displayPassword, hidePasswordTimeout, readonly]);

    // Display the password when certain props change.
    React.useEffect(() => {
        if (!readonly && initialShowPassword === undefined) {
            setDisplayPassword(true);
        }
    }, [initialShowPassword, readonly]);

    // Toggles the password visibility.
    const toggleDisplayPassword = React.useCallback(() => {
        setDisplayPassword(value => !value);
    }, []);

    // Generate a new password into the TextBox.
    const generatePasswordClick = React.useCallback(() => {
        onValueChanged?.(generatePassword());
    }, [onValueChanged]);

    // Copy the password value into the clipboard.
    const copyToClipboard = React.useCallback(() => {
        const text = value;
        if (text) {
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    notification("success", lu("clipboardCopySuccess"), 5);
                    clipboardNotifyOther();
                })
                .catch(() => {
                    notification("error", lu("clipboardCopyFailed"), 5);
                });
        }
    }, [lu, notification, value]);

    // Memoize the tooltip for the password visibility toggle
    // button based on the value whether to display the password.
    const toggleShowPasswordHint = React.useMemo(() => {
        return displayPassword ? lu("hidePassword") : lu("showPassword");
    }, [displayPassword, lu]);

    const onChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChanged?.(e.target.value);
        },
        [onValueChanged]
    );

    return (
        <div className={classNames(PasswordTextBox.name, className)}>
            {contextHolder}
            {displayPassword ? (
                <Input //
                    readOnly={readonly}
                    className="PasswordTextBox-textBox"
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    ref={inputRef}
                />
            ) : (
                <Input.Password //
                    readOnly={readonly}
                    className="PasswordTextBox-textBox"
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    ref={inputRef}
                />
            )}
            <Tooltip title={toggleShowPasswordHint}>
                <Button //
                    icon={displayPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                    className="PasswordTextBox-button"
                    onClick={toggleDisplayPassword}
                />
            </Tooltip>
            {showGeneratePassword === true &&
                readonly === false && ( //
                    <Tooltip title={lu("generatePassword")}>
                        <Button //
                            icon={<FontAwesomeIcon icon={faRotate} />}
                            onClick={generatePasswordClick}
                            className="PasswordTextBox-button"
                        />
                    </Tooltip>
                )}
            {showCopyButton && (
                <Tooltip title={lu("copyClipboard")}>
                    <Button //
                        icon={<FontAwesomeIcon icon={faCopy} />}
                        className="PasswordTextBox-button"
                        onClick={copyToClipboard}
                    />
                </Tooltip>
            )}
        </div>
    );
};

/**
 * Generates a simple password using lowercase a-z, uppercase A-Z, number 0-9 and @, # and $ characters.
 * @param length The length of the password to generate.
 * @returns A password generated with the specified length.
 */
const generatePassword = (length = 12) => {
    let pass = "";
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= length; i++) {
        const char = Math.floor(Math.random() * str.length + 1);

        pass += str.charAt(char);
    }

    return pass;
};

const StyledPasswordTextBox = styled(PasswordTextBox)`
    display: flex;
    flex-direction: row;
    .PasswordTextBox-textBox {
        width: 100%;
    }
    .PasswordTextBox-button {
        margin-left: 6px;
    }
`;

export { StyledPasswordTextBox };
