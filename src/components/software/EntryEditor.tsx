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
import classNames from "classnames";
import { styled } from "styled-components";
import { Button, CheckBox, ScrollView, TagBox, TextArea, TextBox } from "devextreme-react";
import { ValueChangedEvent as CheckBoxValueChangedEvent } from "devextreme/ui/check_box";
import dxTextBox, { InitializedEvent, ValueChangedEvent as TextBoxValueChangedEvent } from "devextreme/ui/text_box";
import { CustomItemCreatingEvent, ValueChangedEvent as TagBoxValueChangedEvent } from "devextreme/ui/tag_box";
import { DataEntry } from "../../types/PasswordEntry";
import { useLocalize } from "../../i18n";
import { CommonProps } from "../Types";
import { StyledPasswordTextBox } from "../reusable/inputs/PasswordTextBox";
import { TwoFactorAuthCodeGeneratorStyled } from "../reusable/TwoFactorAuthCodeGenerator";
import { DisplayQrCodePopupStyled } from "../reusable/DisplayQrCodePopup";
import { MarkDownViewStyled } from "../reusable/MarkDownView";
import { MarkdownTextEditorStyled } from "../reusable/MarkdownTextEditor";
import { QrCodeInputPopupStyled } from "./popups/QrCodeInputPopup";

/**
 * The props for the {@link EntryEditor} component.
 */
type EntryEditorProps = {
    /** The current {@link DataEntry} value which is an item, NOT a category. */
    entry?: DataEntry | null;
    /** A value indicating whether the editor is in read-only mode. E.g. display item mode. */
    readOnly?: boolean;
    /** A value indicating whether this popup is visible. */
    visible?: boolean;
    /** A value in seconds the password editor should hide the password. */
    hidePasswordTimeout?: number;
    /** A value indicating whether the password generate button is visible. */
    showGeneratePassword?: boolean;
    /** A value indicating whether the copy password to clipboard is visible. */
    showCopyButton?: boolean;
    /** A ref to the item name text box. */
    nameTextBoxRef?: React.MutableRefObject<dxTextBox | undefined>;
    /** A value indicating if the 2FA QR-code popup should be hidden. */
    hideQrAuthPopup: boolean;
    /** All the tags contained within the current file. */
    allTags?: string[];
    /** A value indicating whether the QR code view popup button should be displayed. */
    showQrViewButton?: boolean;
    /**
     * Occurs when the {@link entry} prop value has been changed. The component itself is stateless.
     * @param {DataEntry} entry The value of the changed item entry.
     * @returns {void} void.
     */
    onEntryChanged?: (entry: DataEntry) => void;
} & CommonProps;

/**
 * A component to either display or edit items. NOT categories.
 * @param param0 The component props: {@link EntryEditorProps}.
 * @returns A component.
 */
const EntryEditor = ({
    className, //
    entry,
    readOnly = true,
    visible = true,
    hidePasswordTimeout,
    showGeneratePassword,
    showCopyButton = false,
    nameTextBoxRef,
    hideQrAuthPopup,
    showQrViewButton = true,
    allTags,
    onEntryChanged,
}: EntryEditorProps) => {
    const [qrCodeVisible, setQrCodeVisible] = React.useState(false);
    const [qrCodePopupVisible, setQrCodePopupVisible] = React.useState(false);

    const le = useLocalize("entries");
    const lu = useLocalize("ui");

    // The 2F2 authentication code was changed. Update the data.
    const qrCodePopupClose = React.useCallback(
        (userAccepted: boolean, otpAuthKey?: string | undefined) => {
            if (userAccepted && otpAuthKey && entry) {
                const newValue: DataEntry = { ...entry, otpAuthKey: otpAuthKey };
                onEntryChanged?.(newValue);
                setQrCodeVisible(false);
            } else {
                setQrCodeVisible(false);
            }
        },
        [entry, onEntryChanged]
    );

    // The QR code popup was closed so hide it.
    const qrCodePopupDisplayClose = React.useCallback(() => {
        setQrCodePopupVisible(false);
    }, []);

    // A value change callback to handle the changes of all the text boxes
    // within the component.
    const onValueChanged = React.useCallback(
        (e: TextBoxValueChangedEvent, name: keyof DataEntry) => {
            if (readOnly || (entry ?? null) === null) {
                return;
            }

            if (entry) {
                const newValue: DataEntry = { ...entry };
                newValue[name] = e.value as never;
                onEntryChanged?.(newValue);
            }
        },
        [entry, onEntryChanged, readOnly]
    );

    // The item name was changed.
    const onNameChanged = React.useCallback(
        (e: TextBoxValueChangedEvent) => {
            onValueChanged(e, "name");
        },
        [onValueChanged]
    );

    // The item domain value was changed.
    const onDomainChanged = React.useCallback(
        (e: TextBoxValueChangedEvent) => {
            onValueChanged(e, "domain");
        },
        [onValueChanged]
    );

    // The item user name was changed.
    const onUserNameChanged = React.useCallback(
        (e: TextBoxValueChangedEvent) => {
            onValueChanged(e, "userName");
        },
        [onValueChanged]
    );

    // The item password was changed.
    const onPasswordChanged = React.useCallback(
        (e: TextBoxValueChangedEvent) => {
            onValueChanged(e, "password");
        },
        [onValueChanged]
    );

    // The item notes was changed.
    const onNotesChanged = React.useCallback(
        (e: TextBoxValueChangedEvent) => {
            onValueChanged(e, "notes");
        },
        [onValueChanged]
    );

    // The use markdown flag value changed. Update the value.
    const onUseMarkdownChanged = React.useCallback(
        (e: CheckBoxValueChangedEvent) => {
            if (entry) {
                onEntryChanged?.({ ...entry, useMarkdown: e.value });
            }
        },
        [entry, onEntryChanged]
    );

    // The markdown editor value changed, set the notes value.
    const setMarkDown = React.useCallback(
        (value: string | undefined) => {
            if (entry) {
                onEntryChanged?.({ ...entry, notes: value });
            }
        },
        [entry, onEntryChanged]
    );

    // The OTPAuth / 2FA key changed, update the value.
    const onOTPAuthChanged = React.useCallback(
        (e: TextBoxValueChangedEvent) => {
            onValueChanged(e, "otpAuthKey");
        },
        [onValueChanged]
    );

    // Save the ref to the name TextBox if the ref prop is defined.
    const onNameTextBoxInitialized = React.useCallback(
        (e: InitializedEvent) => {
            if (nameTextBoxRef !== undefined) {
                nameTextBoxRef.current = e.component;
            }
        },
        [nameTextBoxRef]
    );

    // Update the changed tag(s) to the entry and report any removed items.
    const onTagsValueChanged = React.useCallback(
        (e: TagBoxValueChangedEvent) => {
            const value: string[] = e.value ?? [];

            // Update the entry.
            if (entry) {
                const newTags = value.join("|");
                const newValue: DataEntry = { ...entry, tags: newTags };
                onEntryChanged?.(newValue);
            }
        },
        [entry, onEntryChanged]
    );

    // A new tag was added. Report the added tag to keep the "index" in sync.
    const onCustomTagCreating = React.useCallback(
        (e: CustomItemCreatingEvent) => {
            e.customItem = e.text ?? null;
            const newTag: string = e.customItem;

            // Update the entry.
            if (entry) {
                const value = [...(entry.tags ?? []), newTag];
                const newTags = value.join("|");
                const newValue: DataEntry = { ...entry, tags: newTags };
                onEntryChanged?.(newValue);
            }
        },
        [entry, onEntryChanged]
    );

    const readQrCodeClick = React.useCallback(() => {
        setQrCodeVisible(true);
    }, []);

    // Display the QR code view popup.
    const displayQrCodeClick = React.useCallback(() => {
        setQrCodePopupVisible(true);
    }, []);

    // If the entry changes, hide the QR code popup,
    React.useEffect(() => {
        setQrCodePopupVisible(false);
    }, [entry]);

    const tags = React.useMemo(() => entry?.tags?.split("|") ?? [], [entry?.tags]);

    // Memoize the disabled value for the view QR code button.
    const displayQrCodeDisabled = React.useMemo(() => !(entry?.otpAuthKey ?? "").startsWith("otpauth"), [entry?.otpAuthKey]);

    return (
        <>
            {visible && (
                <div className={classNames(EntryEditor.name, className)}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="dx-field-item-label-text">{le("name")}</div>
                                </td>
                                <td>
                                    <TextBox //
                                        readOnly={readOnly}
                                        value={entry?.name}
                                        onValueChanged={onNameChanged}
                                        onInitialized={onNameTextBoxInitialized}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dx-field-item-label-text">{le("domain")}</div>
                                </td>
                                <td>
                                    <TextBox //
                                        readOnly={readOnly}
                                        value={entry?.domain}
                                        onValueChanged={onDomainChanged}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dx-field-item-label-text">{le("userName")}</div>
                                </td>
                                <td>
                                    <TextBox //
                                        readOnly={readOnly}
                                        value={entry?.userName}
                                        onValueChanged={onUserNameChanged}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dx-field-item-label-text">{le("password")}</div>
                                </td>
                                <td>
                                    <div>
                                        <StyledPasswordTextBox
                                            hidePasswordTimeout={hidePasswordTimeout}
                                            readonly={readOnly}
                                            value={entry?.password}
                                            onValueChanged={onPasswordChanged}
                                            showGeneratePassword={showGeneratePassword}
                                            showCopyButton={showCopyButton}
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dx-field-item-label-text">{le("tags")}</div>
                                </td>
                                <td>
                                    <TagBox //
                                        dataSource={allTags}
                                        readOnly={readOnly}
                                        value={tags}
                                        onValueChanged={onTagsValueChanged}
                                        onCustomItemCreating={onCustomTagCreating}
                                        acceptCustomValue={true}
                                        searchEnabled={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dx-field-item-label-text">{le("otpAuthUrl")}</div>
                                </td>
                                <td>
                                    <div className="OTPAuth">
                                        <TextBox //
                                            readOnly={true}
                                            value={entry?.otpAuthKey}
                                            onValueChanged={onOTPAuthChanged}
                                            className="OTPAuth-textBox"
                                        />
                                        {showQrViewButton && (
                                            <Button //
                                                hint={lu("displayQrCodeTitle")}
                                                icon="find"
                                                disabled={displayQrCodeDisabled}
                                                onClick={displayQrCodeClick}
                                            />
                                        )}
                                        <Button //
                                            hint={lu("readQrCodeTitle")}
                                            icon="fas fa-qrcode"
                                            disabled={readOnly}
                                            onClick={readQrCodeClick}
                                        />
                                    </div>
                                </td>
                            </tr>
                            {entry?.otpAuthKey && (
                                <tr>
                                    <td>
                                        <div className="dx-field-item-label-text">{le("otpAuthKey")}</div>
                                    </td>
                                    <td>
                                        <TwoFactorAuthCodeGeneratorStyled //
                                            otpAuthUrl={entry?.otpAuthKey}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="Notes-labelArea">
                        <div className="dx-field-item-label-text">{le("notes")}</div>
                        {!readOnly && (
                            <CheckBox //
                                text={le("useMarkdown")}
                                onValueChanged={onUseMarkdownChanged}
                                value={entry?.useMarkdown ?? false}
                            />
                        )}
                    </div>
                    {entry?.useMarkdown === true ? (
                        readOnly ? (
                            <ScrollView //
                                className="EntryEditor-TextArea"
                            >
                                <MarkDownViewStyled //
                                    markDown={entry?.notes}
                                />
                            </ScrollView>
                        ) : (
                            <MarkdownTextEditorStyled //
                                markDown={entry?.notes}
                                setMarkDown={setMarkDown}
                                className="EntryEditor-TextArea"
                            />
                        )
                    ) : (
                        <TextArea //
                            readOnly={readOnly}
                            value={entry?.notes}
                            className="EntryEditor-TextArea"
                            onValueChanged={onNotesChanged}
                        />
                    )}
                    <QrCodeInputPopupStyled //
                        visible={qrCodeVisible && !hideQrAuthPopup}
                        onClose={qrCodePopupClose}
                    />
                    <DisplayQrCodePopupStyled //
                        visible={qrCodePopupVisible}
                        onClose={qrCodePopupDisplayClose}
                        qrUrl={entry?.otpAuthKey}
                    />
                </div>
            )}
        </>
    );
};

const StyledEntryEditor = styled(EntryEditor)`
    display: flex;
    flex-direction: column;
    min-height: 0;
    .EntryEditor-editRow {
        display: flex;
        flex-direction: row;
    }
    .Notes-labelArea {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .EntryEditor-TextArea {
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
        height: 100%;
        min-height: 0px;
    }
    .OTPAuth {
        display: flex;
        flex-direction: row;
    }
    .OTPAuth-textBox {
        width: 100%;
        margin-right: 6px;
    }
`;

export { StyledEntryEditor };
