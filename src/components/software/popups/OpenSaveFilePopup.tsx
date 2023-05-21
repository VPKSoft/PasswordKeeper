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
import { FileQueryMode } from "../../../types/Enums";
import { useLocalize } from "../../../i18n";
import FileQueryTextbox from "../inputs/FileQueryTextbox";
import PasswordTextbox from "../../reusable/inputs/PasswordTextbox";
import { useFocus } from "../../../hooks/UseFocus";

type Props = {
    className?: string;
    visible: boolean;
    mode: FileQueryMode;
    currentFile: string | undefined;
    onClose: (userAccepted: boolean, fileName?: string, password?: string) => void;
};

const OpenSaveFilePopup = ({
    className, //
    visible,
    mode,
    currentFile,
    onClose,
}: Props) => {
    const [userAccepted, setUserAccepted] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [fileName, setFileName] = React.useState<string | undefined>();
    const [password2, setPassword2] = React.useState("");
    const [setFocus, textBoxInitialized] = useFocus();

    React.useEffect(() => {
        if (mode === FileQueryMode.SaveAs && currentFile !== undefined) {
            setFileName(currentFile);
        }
    }, [currentFile, mode, visible]);

    const le = useLocalize("entries");
    const lu = useLocalize("ui");
    const lc = useLocalize("common");

    const title = React.useMemo(() => {
        switch (mode) {
            case FileQueryMode.Open: {
                return lc("openFile");
            }
            case FileQueryMode.Save: {
                return lc("saveFile");
            }
            case FileQueryMode.SaveAs: {
                return lc("saveFileAs");
            }
            default: {
                return lc("openFile");
            }
        }
    }, [lc, mode]);

    React.useEffect(() => {
        if ((fileName ?? "").trim() !== "") {
            setFocus();
        }
    }, [fileName, setFocus]);

    const onCloseCallback = React.useCallback(
        (userAccepted: boolean, fileName?: string, password?: string) => {
            onClose(userAccepted, fileName, password);
            setUserAccepted(false);
            setPassword("");
            // eslint-disable-next-line unicorn/no-useless-undefined
            setFileName(undefined);
        },
        [onClose]
    );

    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onCloseCallback(userAccepted);
            }
            setUserAccepted(false);
        },
        [onCloseCallback, userAccepted]
    );

    const onHiding = React.useCallback(() => {
        onCloseCallback(userAccepted);
        setUserAccepted(false);
    }, [onCloseCallback, userAccepted]);

    const onPassword1Changed = React.useCallback((e: ValueChangedEvent) => {
        setPassword(e.value);
    }, []);

    const canAccept = React.useMemo(() => {
        if (mode === FileQueryMode.SaveAs) {
            return password !== "" && password === password2 && (fileName ?? "") !== "";
        }

        return password !== "" && (fileName ?? "") !== "";
    }, [fileName, mode, password, password2]);

    const onKeyDown = React.useCallback(
        (e: KeyDownEvent) => {
            if (e.event?.key === "Escape") {
                setUserAccepted(false);
                onCloseCallback(false);
            } else if (e.event?.key === "Enter" && canAccept) {
                setUserAccepted(true);
                onCloseCallback(true, fileName, password);
            }
        },
        [canAccept, fileName, onCloseCallback, password]
    );

    const onPassword2Changed = React.useCallback((e: ValueChangedEvent) => {
        setPassword2(e.value);
    }, []);

    const height = React.useMemo(() => {
        return mode === FileQueryMode.SaveAs ? 280 : 240;
    }, [mode]);

    return (
        <Popup //
            title={title}
            showCloseButton={true}
            visible={visible}
            onHiding={onHiding}
            onVisibleChange={onVisibleChange}
            dragEnabled={true}
            resizeEnabled={true}
            height={height}
            width={600}
            showTitle={true}
            onShown={setFocus}
        >
            <div className={classNames(OpenSaveFilePopup.name, className)}>
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
                                        mode={mode}
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
                                        onInitialized={textBoxInitialized}
                                    />
                                </div>
                            </td>
                        </tr>
                        {mode === FileQueryMode.SaveAs && (
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
                                            initialShowPassword={false}
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
                            onCloseCallback(true, fileName, password);
                        }}
                        disabled={!canAccept}
                    />
                    <Button //
                        text={lu("cancel")}
                        onClick={() => {
                            setUserAccepted(false);
                            onCloseCallback(false);
                        }}
                    />
                </div>
            </div>
        </Popup>
    );
};

export default styled(OpenSaveFilePopup)`
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
