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
import styled from "styled-components";
import { TextArea, TextBox } from "devextreme-react";
import { ValueChangedEvent } from "devextreme/ui/text_area";
import dxTextBox, { InitializedEvent, ValueChangedEvent as TextBoxValueChangedEvent } from "devextreme/ui/text_box";
import { DataEntry } from "../../types/PasswordEntry";
import { useLocalize } from "../../i18n";
import { CommonProps } from "../Types";
import { StyledPasswordTextBox } from "../reusable/inputs/PasswordTextBox";

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
    onEntryChanged,
}: EntryEditorProps) => {
    const le = useLocalize("entries");

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
        (e: ValueChangedEvent) => {
            onValueChanged(e, "notes");
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
                        </tbody>
                    </table>
                    <div className="dx-field-item-label-text">{le("notes")}</div>
                    <TextArea readOnly={readOnly} value={entry?.notes} className="EntryEditor-TextArea" onValueChanged={onNotesChanged} />
                </div>
            )}
        </>
    );
};

const StyledEntryEditor = styled(EntryEditor)`
    display: flex;
    flex-direction: column;
    .EntryEditor-editRow {
        display: flex;
        flex-direction: row;
    }
    .EntryEditor-TextArea {
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
        height: 100%;
        min-height: 0px;
    }
`;

export { StyledEntryEditor };
