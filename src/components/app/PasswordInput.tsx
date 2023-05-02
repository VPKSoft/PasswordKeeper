import classNames from "classnames";
import { TextBox, Button as TextBoxButton } from "devextreme-react/text-box";
import { ValueChangedEvent } from "devextreme/ui/text_box";
import * as React from "react";
import styled from "styled-components";

type Props = {
    className?: string;
    label?: string;
    onValueChanged?: (value: string) => void;
    password?: boolean;
};

const PasswordInput = ({
    className, //
    label,
    onValueChanged,
    password = true,
}: Props) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const passwordButtonOptions = {
        icon: showPassword ? "fas fa-eye" : "fas fa-eye-slash",
        type: "default",
        onClick: () => {
            setShowPassword(value => !value);
        },
    };

    const onValueChangedCallback = React.useCallback(
        (e: ValueChangedEvent) => {
            onValueChanged?.(e.value);
        },
        [onValueChanged]
    );

    return (
        <div className={classNames(PasswordInput.name, className, "dx-field")}>
            <div className="dx-field-label">{label}</div>
            <div className="dx-field-value">
                <TextBox mode={showPassword ? "password" : "text"} onValueChanged={onValueChangedCallback}>
                    {password && <TextBoxButton name="password" location="after" options={passwordButtonOptions} />}
                </TextBox>
            </div>
        </div>
    );
};

export default styled(PasswordInput)`
    // Add style(s)
`;
