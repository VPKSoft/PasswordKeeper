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
import classNames from "classnames";
import { styled } from "styled-components";
import { useLocalize } from "../../../i18n";
import { CommonProps } from "../../Types";
import { DataEntry } from "../../../types/PasswordEntry";
import { EntryNotesEditorStyled } from "../EntryNotesEditor";

/**
 * The props for the {@link EntryNotesEditorPopup} component.
 */
type EntryNotesEditorPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** The current {@link DataEntry} value which is an item, NOT a category. */
    entry?: DataEntry | null;
    /** A value indicating whether to use Markdown by default in the notes editor. */
    defaultUseMarkdown?: boolean;
    /** A value indicating whether to use monospaced font by default in the notes editor. */
    defaultUseMonospacedFont?: boolean;
    /** A value indicating whether to use HTML on entry editing and rendering. */
    imagePasteEnabled: boolean;
    /**
     * A callback which occurs when the popup is closed.
     * @param {boolean} userAccepted A value indicating whether the user accepted the popup.
     * @param {string | undefined} notes The new notes value.
     * @returns {void} void.
     */
    onClose: (userAccepted: boolean, notes?: string | undefined) => void;
} & CommonProps;

const EntryNotesEditorPopup = ({
    className, //
    visible,
    entry,
    defaultUseMarkdown,
    defaultUseMonospacedFont,
    imagePasteEnabled,
    onClose,
}: EntryNotesEditorPopupProps) => {
    const [notes, setNotes] = React.useState<string>();

    const lu = useLocalize("ui");
    const le = useLocalize("entries");

    // Update the state when the entry changes.
    React.useEffect(() => {
        setNotes(entry?.notes);
    }, [entry?.notes]);

    // Raise the onClose if the popup is closed via the "X" button or is canceled.
    const onHiding = React.useCallback(() => {
        if (visible) {
            onClose(false);
        }
    }, [onClose, visible]);

    // Raise the onClose with userAccepted set to true with the value of the current notes.
    const onOkClick = React.useCallback(() => {
        if (visible) {
            onClose(true, notes);
        }
    }, [notes, onClose, visible]);

    return (
        <Popup //
            title={le("editNotes")}
            showCloseButton={true}
            visible={visible}
            dragEnabled={true}
            resizeEnabled={true}
            height={700}
            width={700}
            showTitle={true}
            onHiding={onHiding}
        >
            <div className={classNames(EntryNotesEditorPopup.name, className)}>
                <EntryNotesEditorStyled //
                    readOnly={false}
                    entry={entry}
                    defaultUseMarkdown={defaultUseMarkdown}
                    defaultUseMonospacedFont={defaultUseMonospacedFont}
                    imagePasteEnabled={imagePasteEnabled}
                    onNotesChanged={setNotes}
                />
                <div className="Popup-ButtonRow">
                    <Button //
                        text={lu("ok")}
                        onClick={onOkClick}
                    />
                    <Button //
                        text={lu("cancel")}
                        onClick={onHiding}
                    />
                </div>
            </div>
        </Popup>
    );
};

const StyledAEntryNotesEditorPopup = styled(EntryNotesEditorPopup)`
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

export { StyledAEntryNotesEditorPopup };
