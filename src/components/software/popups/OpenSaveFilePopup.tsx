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
import { styled } from "styled-components";
import classNames from "classnames";
import { KeyDownEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import { FileQueryMode } from "../../../types/Enums";
import { useLocalize } from "../../../i18n";
import { useFocus } from "../../../hooks/UseFocus";
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
    const [userAccepted, setUserAccepted] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [fileName, setFileName] = React.useState<string | undefined>();
    const [password2, setPassword2] = React.useState("");
    const [setFocus, textBoxInitialized] = useFocus();

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
            setFocus();
        }
    }, [fileName, setFocus]);

    // Raise the onClose callback and reset the state.
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

    // Handle the onVisibleChange callback of the Popup component.
    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onCloseCallback(userAccepted);
            }
            setUserAccepted(false);
        },
        [onCloseCallback, userAccepted]
    );

    // Handle the onHiding callback of the Popup component.
    const onHiding = React.useCallback(() => {
        onCloseCallback(userAccepted);
        setUserAccepted(false);
    }, [onCloseCallback, userAccepted]);

    // The first password component's value changed. Set it to state.
    const onPassword1Changed = React.useCallback((e: ValueChangedEvent) => {
        setPassword(e.value);
    }, []);

    // The second password component's value changed. Set it to state.
    const onPassword2Changed = React.useCallback((e: ValueChangedEvent) => {
        setPassword2(e.value);
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

    // Memoize the height of the popup depending of the mode.
    const height = React.useMemo(() => {
        return mode === FileQueryMode.SaveAs ? 280 : 240;
    }, [mode]);

    // The OK button was clicked.
    const onOkClick = React.useCallback(() => {
        setUserAccepted(true);
        onCloseCallback(true, fileName, password);
    }, [fileName, onCloseCallback, password]);

    // The Cancel button was clicked.
    const onCancelClick = React.useCallback(() => {
        setUserAccepted(false);
        onCloseCallback(false);
    }, [onCloseCallback]);

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
                                <div className="dx-field-item-label-text">{le("password")}</div>
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
                        text={lu("ok")}
                        onClick={onOkClick}
                        disabled={!canAccept}
                    />
                    <Button //
                        text={lu("cancel")}
                        onClick={onCancelClick}
                    />
                </div>
            </div>
        </Popup>
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
