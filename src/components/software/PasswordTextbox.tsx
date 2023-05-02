import classNames from "classnames";
import Button from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import dxTextBox, { InitializedEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import * as React from "react";
import styled from "styled-components";
import notify from "devextreme/ui/notify";
import { useLocalize } from "../../i18n";

type Props = {
    className?: string;
    readonly?: boolean;
    value?: string | undefined;
    hidePasswordTimeout?: number;
    showGeneratePassword?: boolean;
    showCopyButton?: boolean;
    initialShowPassword?: boolean;
    onValueChanged?: (e: ValueChangedEvent) => void;
};

const PasswordTextbox = ({
    readonly = false, //
    className,
    value,
    showGeneratePassword,
    hidePasswordTimeout,
    showCopyButton,
    initialShowPassword,
    onValueChanged,
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

    const onInitialized = React.useCallback((e: InitializedEvent) => {
        textBoxRef.current = e.component;
    }, []);

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

    const toggeShowPasswordHint = React.useMemo(() => {
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
            />
            <Button //
                icon={displayPassword ? "fas fa-eye" : "fas fa-eye-slash"}
                className="PasswordTextbox-button"
                onClick={toggleDisplayPassword}
                hint={toggeShowPasswordHint}
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
