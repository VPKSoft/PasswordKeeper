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
import { Button, Input, InputRef, Modal } from "antd";
import { ModifyType } from "../../../types/Enums";
import { useLocalize } from "../../../i18n";
import { DataEntry } from "../../../types/PasswordEntry";
import { CommonProps } from "../../Types";

/**
 * The props for the {@link EditCategoryPopup} component.
 */
type EditCategoryPopupProps = {
    /** The currently active entry. */
    entry: DataEntry;
    /** The edit mode of the {@link entry} */
    mode: ModifyType;
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** Occurs when the popup has been closed. */
    onClose: (userAccepted: boolean, entry?: DataEntry | undefined) => void;
} & CommonProps;

/**
 * A popup component to edit an existing category or add a new category.
 * @param param0 The component props: {@link EditCategoryPopupProps}.
 * @returns A component.
 */
const EditCategoryPopup = ({
    className, //
    entry,
    mode,
    visible,
    onClose,
}: EditCategoryPopupProps) => {
    const [categoryInternal, setCategoryInternal] = React.useState<DataEntry>(entry);

    const le = useLocalize("entries");
    const lu = useLocalize("ui");

    // Memoize the title for the popup based on the mode.
    const title = React.useMemo(() => (mode === ModifyType.Edit ? lu("renameCategory") : lu("addCategory")), [lu, mode]);

    const inputRef = React.useRef<InputRef>(null);

    // Set the internal state entry.
    React.useEffect(() => {
        setCategoryInternal(entry);
    }, [entry]);

    const onNameChanged = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value: string = typeof e.target.value === "string" ? e.target.value : "";
            setCategoryInternal({ ...categoryInternal, name: value });
        },
        [categoryInternal]
    );

    const validCategoryName = React.useMemo(() => {
        return categoryInternal.name.length > 0 && !categoryInternal.name.endsWith(" ") && !categoryInternal.name.startsWith(" ");
    }, [categoryInternal.name]);

    // Listen to the text box key event to react to Escape and Return keys.
    const onKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose(false);
            } else if (e.key === "Enter" && validCategoryName) {
                onClose(true, categoryInternal);
            }
        },
        [categoryInternal, onClose, validCategoryName]
    );

    // The OK button was clicked.
    const onOkClick = React.useCallback(() => {
        onClose(true, categoryInternal);
    }, [categoryInternal, onClose]);

    // The Cancel button was clicked.
    const onCancelClick = React.useCallback(() => {
        onClose(false);
    }, [onClose]);

    // Set the focus to the text box.
    const afterOpenChange = React.useCallback((open: boolean) => {
        if (open) {
            inputRef.current?.focus();
        }
    }, []);

    return (
        <Modal //
            title={title}
            open={visible}
            width={600}
            centered
            onCancel={onCancelClick}
            footer={null}
            afterOpenChange={afterOpenChange}
        >
            <div className={classNames(EditCategoryPopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div>{le("name")}</div>
                            </td>
                            <td>
                                <Input //
                                    value={categoryInternal?.name}
                                    onChange={onNameChanged}
                                    onKeyDown={onKeyDown}
                                    ref={inputRef}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="Popup-ButtonRow">
                    <Button //
                        onClick={onOkClick}
                        disabled={!validCategoryName}
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

const StyledEditCategoryPopup = styled(EditCategoryPopup)`
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

export { StyledEditCategoryPopup };
