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
import { ValueChangedEvent as TextBoxValueChangedEvent } from "devextreme/ui/text_box";
import { DataEntry } from "../../types/PasswordEntry";
import { useLocalize } from "../../i18n";
import PasswordTextbox from "../reusable/inputs/PasswordTextbox";

type Props = {
    className?: string;
    entry?: DataEntry | null;
    readOnly?: boolean;
    visible?: boolean;
    hidePasswordTimeout?: number;
    showGeneratePassword?: boolean;
    showCopyButton?: boolean;
    onEntryChanged?: (entry: DataEntry) => void;
};

const EntryEditor = ({
    className, //
    entry,
    readOnly = true,
    visible = true,
    hidePasswordTimeout,
    showGeneratePassword,
    showCopyButton = false,
    onEntryChanged,
}: Props) => {
    const le = useLocalize("entries");

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

    const onNameChanged = React.useCallback(
        (e: TextBoxValueChangedEvent) => {
            onValueChanged(e, "name");
        },
        [onValueChanged]
    );

    const onDomainChanged = React.useCallback(
        (e: TextBoxValueChangedEvent) => {
            onValueChanged(e, "domain");
        },
        [onValueChanged]
    );

    const onUserNameChanged = React.useCallback(
        (e: TextBoxValueChangedEvent) => {
            onValueChanged(e, "userName");
        },
        [onValueChanged]
    );

    const onPasswordChanged = React.useCallback(
        (e: TextBoxValueChangedEvent) => {
            onValueChanged(e, "password");
        },
        [onValueChanged]
    );

    const onNotesChanged = React.useCallback(
        (e: ValueChangedEvent) => {
            onValueChanged(e, "notes");
        },
        [onValueChanged]
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
                                    <TextBox readOnly={readOnly} value={entry?.name} onValueChanged={onNameChanged} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dx-field-item-label-text">{le("domain")}</div>
                                </td>
                                <td>
                                    <TextBox readOnly={readOnly} value={entry?.domain} onValueChanged={onDomainChanged} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dx-field-item-label-text">{le("userName")}</div>
                                </td>
                                <td>
                                    <TextBox readOnly={readOnly} value={entry?.userName} onValueChanged={onUserNameChanged} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="dx-field-item-label-text">{le("password")}</div>
                                </td>
                                <td>
                                    <div>
                                        <PasswordTextbox
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

export default styled(EntryEditor)`
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
        min-height: 0;
    }
`;
