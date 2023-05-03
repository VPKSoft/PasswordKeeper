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
import { useLocalize } from "../../i18n";
import { KeyDownEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import PasswordTextbox from "./PasswordTextbox";
import FileQueryTextbox from "./FileQueryTextbox";

type Props = {
    className?: string;
    visible: boolean;
    onClose: (userAccepted: boolean, fileName?: string, password?: string) => void;
};

const OpenFilePopup = ({
    className, //
    visible,
    onClose,
}: Props) => {
    const [userAccepted, setUserAccepted] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [fileName, setFileName] = React.useState<string | undefined>();

    const le = useLocalize("entries");
    const lu = useLocalize("ui");
    const lc = useLocalize("common");

    const title = React.useMemo(() => lc("openFile"), [lc]);

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

    const onPassword1Changed = React.useCallback((e: ValueChangedEvent) => {
        setPassword(e.value);
    }, []);

    const canAccept = React.useMemo(() => {
        return password !== "" && (fileName ?? "") !== "";
    }, [fileName, password]);

    const onKeyDown = React.useCallback(
        (e: KeyDownEvent) => {
            if (e.event?.key === "Escape") {
                setUserAccepted(false);
                onClose(false);
            } else if (e.event?.key === "Enter" && canAccept) {
                setUserAccepted(true);
                onClose(true, fileName, password);
            }
        },
        [canAccept, fileName, onClose, password]
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
            height={240}
            width={600}
            showTitle={true}
        >
            <div className={classNames(OpenFilePopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{lc("fileName")}</div>
                            </td>
                            <td>
                                <div>
                                    <FileQueryTextbox //
                                        value={fileName}
                                        onValueChanged={setFileName}
                                        onKeyDown={onKeyDown}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{le("password")}</div>
                            </td>
                            <td>
                                <div>
                                    <PasswordTextbox //
                                        value={password}
                                        onValueChanged={onPassword1Changed}
                                        showGeneratePassword={false}
                                        showCopyButton={true}
                                        initialShowPassword={false}
                                        onKeyDown={onKeyDown}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="Popup-ButtonRow">
                    <Button //
                        text={lu("ok")}
                        onClick={() => {
                            setUserAccepted(true);
                            onClose(true, fileName, password);
                        }}
                        disabled={!canAccept}
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

export default styled(OpenFilePopup)`
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
