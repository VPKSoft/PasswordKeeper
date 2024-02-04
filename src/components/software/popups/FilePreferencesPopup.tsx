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

import * as React from "react";
import { styled } from "styled-components";
import classNames from "classnames";
import { Button, Modal, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CommonProps } from "../../Types";
import { FileOptions } from "../../../types/PasswordEntry";
import { useLocalize } from "../../../i18n";

/**
 * The props for the {@link FilePreferencesPopup} component.
 */
type FilePreferencesPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** The file options to modify. */
    fileOptions: FileOptions | undefined;
    /**
     * A callback which occurs when the popup is closed.
     * @param {boolean} userAccepted A value indicating whether the user accepted the popup.
     * @param {FileOptions} fileOptions The updated file options in case the popup was accepted.
     * @returns {void} void.
     */
    onClose: (userAccepted: boolean, fileOptions?: FileOptions) => void;
} & CommonProps;

/**
 * A  component ...
 * @param param0 The component props: {@link FilePreferencesPopupProps}.
 * @returns A component.
 */
const FilePreferencesPopup = ({
    className, //
    visible,
    fileOptions,
    onClose,
}: FilePreferencesPopupProps) => {
    const [fileOptionsInternal, setFileOptionsInternal] = React.useState<FileOptions | undefined>(fileOptions);
    const ls = useLocalize("settings");
    const lu = useLocalize("ui");

    // Store the settings passed via the prop to the internal state of the component.
    React.useEffect(() => {
        setFileOptionsInternal(fileOptions);
    }, [fileOptions]);

    const onMonospacedFontChanged = React.useCallback((e: CheckboxChangeEvent) => {
        setFileOptionsInternal(f => ({ ...f, useMonospacedFont: e.target.checked }));
    }, []);

    const onUseMarkdownChanged = React.useCallback((e: CheckboxChangeEvent) => {
        setFileOptionsInternal(f => ({ ...f, useMarkdownOnNotes: e.target.checked }));
    }, []);

    // The OK button was clicked.
    const onOkClick = React.useCallback(() => {
        onClose(true, fileOptionsInternal);
    }, [fileOptionsInternal, onClose]);

    // The Cancel button was clicked.
    const onCancelClick = React.useCallback(() => {
        onClose(false);
    }, [onClose]);

    return (
        <Modal //
            title={ls("filePreferences")}
            open={visible}
            width={600}
            centered
            footer={null}
            onCancel={onCancelClick}
        >
            <div className={classNames(FilePreferencesPopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div>{ls("defaultUseMonoSpacedFontOnNotes")}</div>
                            </td>
                            <td>
                                <Checkbox //
                                    checked={fileOptionsInternal?.useMonospacedFont ?? false}
                                    onChange={onMonospacedFontChanged}
                                    disabled={fileOptionsInternal?.useHtmlOnNotes ?? false}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div>{ls("defaultUseMarkdownOnNotes")}</div>
                            </td>
                            <td>
                                <Checkbox //
                                    checked={fileOptionsInternal?.useMarkdownOnNotes ?? false}
                                    disabled={fileOptionsInternal?.useHtmlOnNotes ?? false}
                                    onChange={onUseMarkdownChanged}
                                />
                            </td>
                        </tr>

                        {/* This might come back when a decision is made of a HTML text editor, perhaps: verbun, https://github.com/ozanyurtsever/verbum
                            <tr>
                            <td>
                                <div>{ls("useHtmlIOnNotes")}</div>
                            </td>
                            <td>
                                <Checkbox //
                                    checked={fileOptionsInternal?.useHtmlOnNotes ?? false}
                                    onChange={onUseHtmlChanged}
                                />
                            </td>
                        </tr> */}
                    </tbody>
                </table>
                <div className="Popup-ButtonRow">
                    <Button //
                        onClick={onOkClick}
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

const FilePreferencesPopupStyled = styled(FilePreferencesPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
    .Popup-ButtonRow {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: flex-end;
    }
`;

export { FilePreferencesPopupStyled };
