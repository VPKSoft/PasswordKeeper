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
import Popup from "devextreme-react/popup";
import { Button, CheckBox } from "devextreme-react";
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
    const [userAccepted, setUserAccepted] = React.useState(false);
    const [fileOptionsInternal, setFileOptionsInternal] = React.useState<FileOptions | undefined>(fileOptions);
    const ls = useLocalize("settings");
    const lu = useLocalize("ui");

    // Store the settings passed via the prop to the internal state of the component.
    React.useEffect(() => {
        setFileOptionsInternal(fileOptions);
    }, [fileOptions]);

    // Handle the onVisibleChange callback of the Popup component.
    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onClose(userAccepted);
            }
            setUserAccepted(false);
        },
        [onClose, userAccepted]
    );

    // Handle the onHiding callback of the Popup component.
    const onHiding = React.useCallback(() => {
        onClose(userAccepted);
        setUserAccepted(false);
    }, [onClose, userAccepted]);

    const onMonospacedFontChanged = React.useCallback((value: boolean | null) => {
        setFileOptionsInternal(f => ({ ...f, useMonospacedFont: value ?? false }));
    }, []);

    const onUseMarkdownChanged = React.useCallback((value: boolean | null) => {
        setFileOptionsInternal(f => ({ ...f, useMarkdownOnNotes: value ?? false }));
    }, []);

    const onUseHtmlChanged = React.useCallback(
        (value: boolean | null) => {
            const options = { ...fileOptionsInternal };
            options.useHtmlOnNotes = value ?? false;
            if (value) {
                options.useMonospacedFont = false;
                options.useMarkdownOnNotes = false;
            }

            setFileOptionsInternal(options);
        },
        [fileOptionsInternal]
    );

    // The OK button was clicked.
    const onOkClick = React.useCallback(() => {
        setUserAccepted(true);
        onClose(true, fileOptionsInternal);
    }, [fileOptionsInternal, onClose]);

    // The Cancel button was clicked.
    const onCancelClick = React.useCallback(() => {
        setUserAccepted(false);
        onClose(false);
    }, [onClose]);

    return (
        <Popup //
            title={ls("filePreferences")}
            showCloseButton={true}
            visible={visible}
            onHiding={onHiding}
            onVisibleChange={onVisibleChange}
            dragEnabled={true}
            resizeEnabled={true}
            height={200}
            width={600}
            showTitle={true}
        >
            <div className={classNames(FilePreferencesPopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{ls("defaultUseMonoSpacedFontOnNotes")}</div>
                            </td>
                            <td>
                                <CheckBox //
                                    value={fileOptionsInternal?.useMonospacedFont ?? false}
                                    onValueChange={onMonospacedFontChanged}
                                    disabled={fileOptionsInternal?.useHtmlOnNotes ?? false}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{ls("defaultUseMarkdownOnNotes")}</div>
                            </td>
                            <td>
                                <CheckBox //
                                    value={fileOptionsInternal?.useMarkdownOnNotes ?? false}
                                    disabled={fileOptionsInternal?.useHtmlOnNotes ?? false}
                                    onValueChange={onUseMarkdownChanged}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{ls("useHtmlIOnNotes")}</div>
                            </td>
                            <td>
                                <CheckBox //
                                    value={fileOptionsInternal?.useHtmlOnNotes ?? false}
                                    onValueChange={onUseHtmlChanged}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="Popup-ButtonRow">
                    <Button //
                        text={lu("ok")}
                        onClick={onOkClick}
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

const FilePreferencesPopupStyled = styled(FilePreferencesPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export { FilePreferencesPopupStyled };
