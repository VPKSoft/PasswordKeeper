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
import { styled } from "styled-components";
import classNames from "classnames";
import { Button, InputRef, Modal } from "antd";
import { FileQueryMode } from "../../../types/Enums";
import { useLocalize } from "../../../i18n";
import { CommonProps } from "../../Types";
import { StyledFileQueryTextBox } from "../inputs/FileQueryTextBox";
import { StyledPasswordTextBox } from "../../reusable/inputs/PasswordTextBox";

/**
 * The props for the {@link OpenSaveFilePopup} component.
 */
type OpenSaveFilePopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** The mode the query the file name in. */
    mode: FileQueryMode;
    /** The current existing file name of the file. This only used if the {@link mode} is set to {@link FileQueryMode.SaveAs}. */
    currentFile: string | undefined;

    /**
     * A callback when the popup is closed.
     * @param {boolean} userAccepted A value indicating whether the user accepted the popup.
     * @param {string} [fileName] The file name to save the file as or open the file from.
     * @param {string} [passWord] The password to use when saving the file as or opening the file.
     * @returns {void}
     */
    onClose: (userAccepted: boolean, fileName?: string, password?: string) => void;
} & CommonProps;

/**
 * A popup component to either open an existing file, save new file or save existing file as.
 * @param param0 The component props: {@link OpenSaveFilePopupProps}.
 * @returns A component.
 */
const OpenSaveFilePopup = ({
    className, //
    visible,
    mode,
    currentFile,
    onClose,
}: OpenSaveFilePopupProps) => {
    const [password, setPassword] = React.useState("");
    const [fileName, setFileName] = React.useState<string | undefined>();
    const [password2, setPassword2] = React.useState("");

    const inputRef = React.useRef<InputRef>(null);

    // Set the file name if passed via props and the mode is FileQueryMode.SaveAs.
    React.useEffect(() => {
        if (mode === FileQueryMode.SaveAs && currentFile !== undefined) {
            setFileName(currentFile);
        }
    }, [currentFile, mode, visible]);

    const le = useLocalize("entries");
    const lu = useLocalize("ui");
    const lc = useLocalize("common");

    // Memoize the popup title based on the mode.
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

    // If the file name is set focus to the password text box.
    React.useEffect(() => {
        if ((fileName ?? "").trim() !== "") {
            inputRef.current?.focus();
        }
    }, [fileName]);

    // Raise the onClose callback and reset the state.
    const onCloseCallback = React.useCallback(
        (userAccepted: boolean, fileName?: string, password?: string) => {
            onClose(userAccepted, fileName, password);
            setPassword("");
            // eslint-disable-next-line unicorn/no-useless-undefined
            setFileName(undefined);
        },
        [onClose]
    );

    // The first password component's value changed. Set it to state.
    const onPassword1Changed = React.useCallback((e: string) => {
        setPassword(e);
    }, []);

    // The second password component's value changed. Set it to state.
    const onPassword2Changed = React.useCallback((e: string) => {
        setPassword2(e);
    }, []);

    // Memoize the value whether the popup can be "accepted". E.g. closed via the OK button.
    const canAccept = React.useMemo(() => {
        if (mode === FileQueryMode.SaveAs) {
            return password !== "" && password === password2 && (fileName ?? "") !== "";
        }

        return password !== "" && (fileName ?? "") !== "";
    }, [fileName, mode, password, password2]);

    // Accept or cancel the popup on key down when the focus is in one of the text boxes and
    // either Escape or Return is pressed.
    const onKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Escape") {
                onCloseCallback(false);
            } else if (e.key === "Enter" && canAccept) {
                onCloseCallback(true, fileName, password);
            }
        },
        [canAccept, fileName, onCloseCallback, password]
    );

    // The OK button was clicked.
    const onOkClick = React.useCallback(() => {
        onCloseCallback(true, fileName, password);
    }, [fileName, onCloseCallback, password]);

    // The Cancel button was clicked.
    const onCancelClick = React.useCallback(() => {
        onCloseCallback(false);
    }, [onCloseCallback]);

    const afterOpenChange = React.useCallback(
        (open: boolean) => {
            if (open && (fileName ?? "").trim() !== "") {
                inputRef.current?.focus();
            }
        },
        [fileName]
    );

    return (
        <Modal //
            title={title}
            open={visible}
            width={600}
            afterOpenChange={afterOpenChange}
            centered
            footer={null}
            onCancel={onCancelClick}
        >
            <div className={classNames(OpenSaveFilePopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div>{lc("fileName")}</div>
                            </td>
                            <td>
                                <div>
                                    <StyledFileQueryTextBox //
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
                                <div>{le("password")}</div>
                            </td>
                            <td>
                                <div>
                                    <StyledPasswordTextBox //
                                        value={password}
                                        onValueChanged={onPassword1Changed}
                                        showGeneratePassword={false}
                                        showCopyButton={true}
                                        initialShowPassword={false}
                                        onKeyDown={onKeyDown}
                                        inputRef={inputRef}
                                    />
                                </div>
                            </td>
                        </tr>
                        {mode === FileQueryMode.SaveAs && (
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
                        onClick={onOkClick}
                        disabled={!canAccept}
                    >
                        {lu("ok")}
                    </Button>
                    <Button //
                        onClick={onCancelClick}
                    >
                        {lu("cancel")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const StyledOpenSaveFilePopup = styled(OpenSaveFilePopup)`
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

export { StyledOpenSaveFilePopup };
