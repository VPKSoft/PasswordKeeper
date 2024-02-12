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
import classNames from "classnames";
import { styled } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPen, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { Button, Checkbox, Input, InputRef, Tooltip } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CssFont, DataEntry } from "../../types/PasswordEntry";
import { Locales, useLocalize } from "../../i18n";
import { CommonProps } from "../Types";
import { StyledPasswordTextBox } from "../reusable/inputs/PasswordTextBox";
import { TwoFactorAuthCodeGeneratorStyled } from "../reusable/TwoFactorAuthCodeGenerator";
import { DisplayQrCodePopupStyled } from "../reusable/DisplayQrCodePopup";
import { TagBox } from "../reusable/inputs/TagBox";
import { QrCodeInputPopupStyled } from "./popups/QrCodeInputPopup";
import { EntryNotesEditorStyled } from "./EntryNotesEditor";
import { StyledAEntryNotesEditorPopup } from "./popups/EntryNotesEditorPopup";

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
    nameTextBoxRef?: React.RefObject<InputRef>;
    /** A value indicating if the 2FA QR-code popup should be hidden. */
    hideQrAuthPopup: boolean;
    /** All the tags contained within the current file. */
    allTags?: string[];
    /** A value indicating whether the QR code view popup button should be displayed. */
    showQrViewButton?: boolean;
    /** A value indicating whether to use Markdown by default in the notes editor. */
    defaultUseMarkdown?: boolean;
    /** A value indicating whether to use monospaced font by default in the notes editor. */
    defaultUseMonospacedFont?: boolean;
    /** An optional font definition for the notes area. */
    notesFont?: CssFont;
    /** The current application locale used by the i18next library. */
    locale: Locales;
    /** A value indicating whether to use HTML rich text on notes. */
    useHtmlOnNotes: boolean | undefined;
    /**
     * Occurs when the {@link entry} prop value has been changed. The component itself is stateless.
     * @param {DataEntry} entry The value of the changed item entry.
     * @returns {void} void.
     */
    onEntryChanged?: (entry: DataEntry) => void;
    onShouldRefreshPopup?: () => void;
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
    defaultUseMarkdown,
    defaultUseMonospacedFont,
    useHtmlOnNotes,
    locale,
    onEntryChanged,
    onShouldRefreshPopup,
}: EntryEditorProps) => {
    const [qrCodeVisible, setQrCodeVisible] = React.useState(false);
    const [qrCodePopupVisible, setQrCodePopupVisible] = React.useState(false);
    const [noteEditorOpen, setNoteEditorOpen] = React.useState(false);

    const countDownColor = "#f05b41";

    const le = useLocalize("entries");
    const lu = useLocalize("ui");

    React.useEffect(() => {
        onShouldRefreshPopup?.();
    }, [onShouldRefreshPopup]);

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
        (e: string, name: keyof DataEntry) => {
            if (readOnly || (entry ?? null) === null) {
                return;
            }

            if (entry) {
                const newValue: DataEntry = { ...entry };
                newValue[name] = e as never;
                onEntryChanged?.(newValue);
            }
        },
        [entry, onEntryChanged, readOnly]
    );

    // The item name was changed.
    const onNameChanged = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChanged(e.target.value, "name");
        },
        [onValueChanged]
    );

    // The item domain value was changed.
    const onDomainChanged = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChanged(e.target.value, "domain");
        },
        [onValueChanged]
    );

    // The item user name was changed.
    const onUserNameChanged = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChanged(e.target.value, "userName");
        },
        [onValueChanged]
    );

    // The item password was changed.
    const onPasswordChanged = React.useCallback(
        (e: string) => {
            if (entry) {
                const newValue: DataEntry = { ...entry };
                newValue["password"] = e;
                onEntryChanged?.(newValue);
            }
        },
        [entry, onEntryChanged]
    );

    // The use markdown flag value changed. Update the value.
    const onUseMarkdownChanged = React.useCallback(
        (e: CheckboxChangeEvent) => {
            if (entry) {
                onEntryChanged?.({ ...entry, useMarkdown: e.target.checked });
            }
        },
        [entry, onEntryChanged]
    );

    const onMonospacedFontChanged = React.useCallback(
        (e: CheckboxChangeEvent) => {
            if (entry) {
                onEntryChanged?.({ ...entry, useMonospacedFont: e.target.checked });
            }
        },
        [entry, onEntryChanged]
    );

    const monoSpacedFont = React.useMemo(() => {
        return entry?.useMonospacedFont ?? defaultUseMonospacedFont ?? false;
    }, [defaultUseMonospacedFont, entry?.useMonospacedFont]);

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
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChanged(e.target.value, "otpAuthKey");
        },
        [onValueChanged]
    );

    // Update the changed tag(s) to the entry and report any removed items.
    const onTagsValueChanged = React.useCallback(
        (values: string[]) => {
            const value: string[] = values;

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
        (value: string) => {
            const newTag: string = value;

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

    // Memoize the current file-wide tags usable in entry tag box.
    const tags = React.useMemo(() => {
        const result = entry?.tags?.split("|") ?? undefined;
        if (result?.length === 1 && result[0] === "") {
            return;
        }
        return result;
    }, [entry?.tags]);

    // A call back to open the separate notes editor upon user interaction.
    const editNotesClick = React.useCallback(() => {
        setNoteEditorOpen(true);
    }, []);

    // A callback to close the separate notes editor based on the user interaction
    // and possibly update the note value.
    const onNotesEditorClose = React.useCallback(
        (userAccepted: boolean, notes?: string | undefined) => {
            if (userAccepted) {
                setMarkDown(notes);
            }
            setNoteEditorOpen(false);
        },
        [setMarkDown]
    );

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
                                    <div>{le("name")}</div>
                                </td>
                                <td>
                                    <Input //
                                        readOnly={readOnly}
                                        value={entry?.name}
                                        onChange={onNameChanged}
                                        ref={nameTextBoxRef}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div>{le("domain")}</div>
                                </td>
                                <td>
                                    <Input //
                                        readOnly={readOnly}
                                        value={entry?.domain}
                                        onChange={onDomainChanged}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div>{le("userName")}</div>
                                </td>
                                <td>
                                    <Input //
                                        readOnly={readOnly}
                                        value={entry?.userName}
                                        onChange={onUserNameChanged}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div>{le("password")}</div>
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
                                    <div>{le("tags")}</div>
                                </td>
                                <td>
                                    <TagBox //
                                        dataSource={allTags}
                                        readOnly={readOnly}
                                        value={tags}
                                        onCustomItemCreating={onCustomTagCreating}
                                        onChange={onTagsValueChanged}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div>{le("otpAuthUrl")}</div>
                                </td>
                                <td>
                                    <div className="OTPAuth">
                                        <Input //
                                            value={entry?.otpAuthKey}
                                            onChange={onOTPAuthChanged}
                                            className="OTPAuth-textBox"
                                            readOnly={readOnly}
                                        />
                                        {showQrViewButton && (
                                            <Tooltip title={lu("displayQrCodeTitle")}>
                                                <Button //
                                                    icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                                                    disabled={displayQrCodeDisabled}
                                                    onClick={displayQrCodeClick}
                                                />
                                            </Tooltip>
                                        )}
                                        <Tooltip title={lu("readQrCodeTitle")}>
                                            <Button //
                                                icon={<FontAwesomeIcon icon={faQrcode} />}
                                                disabled={readOnly}
                                                onClick={readQrCodeClick}
                                            />
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                            {entry?.otpAuthKey && (
                                <tr>
                                    <td>
                                        <div>{le("otpAuthKey")}</div>
                                    </td>
                                    <td>
                                        <TwoFactorAuthCodeGeneratorStyled //
                                            otpAuthUrl={entry?.otpAuthKey}
                                            countdownTimerColor={countDownColor}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="Notes-labelArea">
                        <div className={classNames("Label-center")}>{le("notes")}</div>
                        {!readOnly && (useHtmlOnNotes ?? false) === false && (
                            <Checkbox //
                                onChange={onUseMarkdownChanged}
                                checked={entry?.useMarkdown ?? defaultUseMarkdown ?? false}
                                className="Label-center"
                            >
                                {le("useMarkdown")}
                            </Checkbox>
                        )}
                        {!readOnly && (useHtmlOnNotes ?? false) === false && (
                            <Checkbox //
                                onChange={onMonospacedFontChanged}
                                checked={entry?.useMonospacedFont ?? defaultUseMonospacedFont ?? false}
                                className="Label-center"
                            >
                                {le("monoSpacedFont")}
                            </Checkbox>
                        )}
                        {!readOnly && <Button icon={<FontAwesomeIcon icon={faPen} />} onClick={editNotesClick} />}
                    </div>
                    <EntryNotesEditorStyled //
                        entry={entry}
                        onNotesChanged={setMarkDown}
                        defaultUseMarkdown={entry?.useMarkdown ?? defaultUseMarkdown}
                        defaultUseMonospacedFont={monoSpacedFont}
                        imagePasteEnabled={!(qrCodeVisible && !hideQrAuthPopup) && !qrCodePopupVisible && !noteEditorOpen}
                        readOnly={readOnly}
                        defaultUseHtml={useHtmlOnNotes}
                        locale={locale}
                    />
                    <QrCodeInputPopupStyled //
                        visible={qrCodeVisible && !hideQrAuthPopup && visible}
                        onClose={qrCodePopupClose}
                    />
                    <DisplayQrCodePopupStyled //
                        visible={qrCodePopupVisible && visible}
                        onClose={qrCodePopupDisplayClose}
                        qrUrl={entry?.otpAuthKey}
                    />
                    <StyledAEntryNotesEditorPopup
                        visible={noteEditorOpen && visible}
                        entry={entry}
                        defaultUseMarkdown={entry?.useMarkdown ?? defaultUseMarkdown}
                        defaultUseMonospacedFont={monoSpacedFont}
                        defaultUseHtml={useHtmlOnNotes}
                        imagePasteEnabled={!(qrCodeVisible && !hideQrAuthPopup) && !qrCodePopupVisible && noteEditorOpen}
                        onClose={onNotesEditorClose}
                        locale={locale}
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
    .Label-center {
        display: flex;
        flex-wrap: wrap;
        align-content: center;
    }
    .Notes-labelArea {
        margin-right: 3px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
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
