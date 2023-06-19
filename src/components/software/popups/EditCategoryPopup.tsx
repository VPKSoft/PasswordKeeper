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
import { Button, Popup, TextBox } from "devextreme-react";
import styled from "styled-components";
import classNames from "classnames";
import { KeyDownEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import { ModifyType } from "../../../types/Enums";
import { useLocalize } from "../../../i18n";
import { DataEntry } from "../../../types/PasswordEntry";
import { useFocus } from "../../../hooks/UseFocus";
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
    /** Occurs when the popup hams been closed. */
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
    const [userAccepted, setUserAccepted] = React.useState(false);
    const [categoryInternal, setCategoryInternal] = React.useState<DataEntry>(entry);

    const [setFocus, textBoxInitialized] = useFocus();

    const le = useLocalize("entries");
    const lu = useLocalize("ui");

    // Memoize the title for the popup based on the mode.
    const title = React.useMemo(() => (mode === ModifyType.Edit ? lu("renameCategory") : lu("addCategory")), [lu, mode]);

    // Set the internal state entry.
    React.useEffect(() => {
        setCategoryInternal(entry);
    }, [entry]);

    // Set the focus to the text box.
    const onShown = React.useCallback(() => {
        setFocus();
    }, [setFocus]);

    // Handle the visibility change callback.
    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onClose(userAccepted);
            }
            setUserAccepted(false);
        },
        [onClose, userAccepted]
    );

    // Handle the hiding callback.
    const onHiding = React.useCallback(() => {
        onClose(userAccepted);
        setUserAccepted(false);
    }, [onClose, userAccepted]);

    const onNameChanged = React.useCallback(
        (e: ValueChangedEvent) => {
            const value: string = typeof e.value === "string" ? e.value : "";
            setCategoryInternal({ ...categoryInternal, name: value });
        },
        [categoryInternal]
    );

    const validCategoryName = React.useMemo(() => {
        return categoryInternal.name.length > 0 && !categoryInternal.name.endsWith(" ") && !categoryInternal.name.startsWith(" ");
    }, [categoryInternal.name]);

    // Listen to the text box key event to react to Escape and Return keys.
    const onKeyDown = React.useCallback(
        (e: KeyDownEvent) => {
            if (e.event?.key === "Escape") {
                setUserAccepted(false);
                onClose(false);
            } else if (e.event?.key === "Enter" && validCategoryName) {
                setUserAccepted(true);
                onClose(true, categoryInternal);
            }
        },
        [categoryInternal, onClose, validCategoryName]
    );

    return (
        <Popup //
            title={title}
            showCloseButton={true}
            visible={visible}
            onHiding={onHiding}
            onVisibleChange={onVisibleChange}
            dragEnabled={true}
            resizeEnabled={true}
            height={200}
            width={600}
            showTitle={true}
            onShown={onShown}
        >
            <div className={classNames(EditCategoryPopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{le("name")}</div>
                            </td>
                            <td>
                                <TextBox //
                                    value={entry?.name}
                                    onValueChanged={onNameChanged}
                                    onKeyDown={onKeyDown}
                                    onInitialized={textBoxInitialized}
                                    valueChangeEvent="keyup blur change input focusout keydown"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="Popup-ButtonRow">
                    <Button //
                        text={lu("ok")}
                        onClick={() => {
                            setUserAccepted(true);
                            onClose(true, categoryInternal);
                        }}
                        disabled={!validCategoryName}
                    />
                    <Button //
                        text={lu("cancel")}
                        onClick={() => {
                            setUserAccepted(false);
                            onClose(false);
                        }}
                    />
                </div>
            </div>
        </Popup>
    );
};

export default styled(EditCategoryPopup)`
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
