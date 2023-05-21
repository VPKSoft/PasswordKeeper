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
import Button from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import dxTextBox, { InitializedEvent, KeyDownEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import * as React from "react";
import styled from "styled-components";
import notify from "devextreme/ui/notify";
import { useLocalize } from "../../../i18n";

type Props = {
    className?: string;
    readonly?: boolean;
    value?: string | undefined;
    hidePasswordTimeout?: number;
    showGeneratePassword?: boolean;
    showCopyButton?: boolean;
    initialShowPassword?: boolean;
    onValueChanged?: (e: ValueChangedEvent) => void;
    onKeyDown?: (e: KeyDownEvent) => void;
    onInitialized?: (e: InitializedEvent) => void;
};

const PasswordTextbox = ({
    readonly = false, //
    className,
    value,
    showGeneratePassword,
    hidePasswordTimeout,
    showCopyButton,
    initialShowPassword,
    onInitialized: onInitializedCallback,
    onValueChanged,
    onKeyDown,
}: Props) => {
    const [displayPassword, setDisplayPassword] = React.useState(initialShowPassword ?? false);

    const lu = useLocalize("ui");

    const textBoxRef = React.useRef<dxTextBox>();

    React.useEffect(() => {
        if (hidePasswordTimeout && hidePasswordTimeout > 0 && displayPassword && readonly) {
            const timer = window.setInterval(() => {
                setDisplayPassword(false);
            }, hidePasswordTimeout * 1_000);

            return () => window.clearInterval(timer);
        }
    }, [displayPassword, hidePasswordTimeout, readonly]);

    React.useEffect(() => {
        if (!readonly && initialShowPassword === undefined) {
            setDisplayPassword(true);
        }
    }, [initialShowPassword, readonly]);

    const toggleDisplayPassword = React.useCallback(() => {
        setDisplayPassword(value => !value);
    }, []);

    const onInitialized = React.useCallback(
        (e: InitializedEvent) => {
            onInitializedCallback?.(e);
            textBoxRef.current = e.component;
        },
        [onInitializedCallback]
    );

    const generatePasswordClick = React.useCallback(() => {
        textBoxRef.current?.option("value", generatePassword());
    }, []);

    const copyToClipboard = React.useCallback(() => {
        const text = textBoxRef?.current?.option("value") as string | undefined;
        if (text) {
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    notify(lu("clipboardCopySuccess"), "success", 2_000);
                })
                .catch(() => {
                    notify(lu("clipboardCopyFailed"), "error", 2_000);
                });
        }
    }, [lu]);

    const toggleShowPasswordHint = React.useMemo(() => {
        return displayPassword ? lu("hidePassword") : lu("showPassword");
    }, [displayPassword, lu]);

    return (
        <div className={classNames(PasswordTextbox.name, className)}>
            <TextBox //
                onInitialized={onInitialized}
                readOnly={readonly}
                mode={displayPassword ? "text" : "password"}
                className="PasswordTextbox-textBox"
                value={value}
                onValueChanged={onValueChanged}
                onKeyDown={onKeyDown}
                valueChangeEvent="keyup blur change input focusout keydown"
            />
            <Button //
                icon={displayPassword ? "fas fa-eye" : "fas fa-eye-slash"}
                className="PasswordTextbox-button"
                onClick={toggleDisplayPassword}
                hint={toggleShowPasswordHint}
            />
            {showGeneratePassword === true &&
                readonly === false && ( //
                    <Button //
                        icon="fas fa-rotate"
                        onClick={generatePasswordClick}
                        className="PasswordTextbox-button"
                        hint={lu("generatePassword")}
                    />
                )}
            {showCopyButton && (
                <Button //
                    hint={lu("copyClipboard")}
                    icon="copy"
                    className="PasswordTextbox-button"
                    onClick={copyToClipboard}
                />
            )}
        </div>
    );
};

const generatePassword = (length = 12) => {
    let pass = "";
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= length; i++) {
        const char = Math.floor(Math.random() * str.length + 1);

        pass += str.charAt(char);
    }

    return pass;
};

export default styled(PasswordTextbox)`
    display: flex;
    flex-direction: row;
    .PasswordTextbox-textBox {
        width: 100%;
    }
    .PasswordTextbox-button {
        margin-left: 6px;
    }
`;
