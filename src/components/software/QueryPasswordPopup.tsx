import * as React from "react";
import { Button, Popup } from "devextreme-react";
import styled from "styled-components";
import classNames from "classnames";
import { useLocalize } from "../../i18n";
import { ValueChangedEvent } from "devextreme/ui/text_box";
import PasswordTextbox from "./PasswordTextbox";

type Props = {
    className?: string;
    visible: boolean;
    verifyMode?: boolean;
    initialShowPassword?: boolean;
    onClose: (useAccepted: boolean, password?: string) => void;
};

const QueryPasswordPopup = ({
    className, //
    visible,
    verifyMode = false,
    initialShowPassword,
    onClose,
}: Props) => {
    const [useAccepted, setUserAccepted] = React.useState(false);
    const [password1, setPassword1] = React.useState("");
    const [password2, setPassword2] = React.useState("");

    const le = useLocalize("entries");
    const lu = useLocalize("ui");
    const lc = useLocalize("common");

    const title = React.useMemo(() => lc("givePassword"), [lc]);

    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onClose(useAccepted);
            }
            setUserAccepted(false);
        },
        [onClose, useAccepted]
    );

    const onHiding = React.useCallback(() => {
        onClose(useAccepted);
        setUserAccepted(false);
    }, [onClose, useAccepted]);

    const onPassword1Changed = React.useCallback((e: ValueChangedEvent) => {
        setPassword1(e.value);
    }, []);

    const onPassword2Changed = React.useCallback((e: ValueChangedEvent) => {
        setPassword2(e.value);
    }, []);

    return (
        <Popup //
            title={title}
            showCloseButton={true}
            visible={visible}
            onHiding={onHiding}
            onVisibleChange={onVisibleChange}
            dragEnabled={true}
            resizeEnabled={true}
            height={verifyMode ? 240 : 200}
            width={600}
            showTitle={true}
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
