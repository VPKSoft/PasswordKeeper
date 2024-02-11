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
import { Button, InputRef, Modal } from "antd";
import { ModifyType } from "../../../types/Enums";
import { Locales, useLocalize } from "../../../i18n";
import { CssFont, DataEntry } from "../../../types/PasswordEntry";
import { CommonProps } from "../../Types";
import { StyledEntryEditor } from "../EntryEditor";

/**
 * The props for the {@link EditEntryPopup} component.
 */
type EditEntryPopupProps = {
    /** The currently active entry. */
    entry: DataEntry | undefined;
    /** The edit mode of the {@link entry} */
    mode: ModifyType;
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** All the tags contained within the current file. */
    allTags?: string[];
    /** A value indicating whether to use Markdown by default in the notes editor. */
    defaultUseMarkdown?: boolean;
    /** A value indicating whether to use monospaced font by default in the notes editor. */
    defaultUseMonospacedFont?: boolean;
    /** A value indicating whether to use HTML rich text on notes. */
    useHtmlOnNotes: boolean | undefined;
    /** The current application locale used by the i18next library. */
    locale: Locales;
    /** An optional font definition for the notes area. */
    notesFont?: CssFont;
    /** Occurs when the popup has been closed. */
    onClose: (userAccepted: boolean, entry?: DataEntry | undefined) => void;
} & CommonProps;

/**
 * A popup component to edit an existing entry or add a new entry.
 * @param param0 The component props: {@link EditEntryPopupProps}.
 * @returns A component.
 */
const EditEntryPopup = ({
    className, //
    entry,
    mode,
    visible,
    allTags,
    defaultUseMarkdown,
    defaultUseMonospacedFont,
    notesFont,
    useHtmlOnNotes,
    locale,
    onClose,
}: EditEntryPopupProps) => {
    const [entryInternal, setEntryInternal] = React.useState<DataEntry | undefined>();

    const focusTextBoxRef = React.useRef<InputRef>(null);

    const le = useLocalize("entries");
    const lu = useLocalize("ui");

    // Memoize the title for the popup based on the mode.
    const title = React.useMemo(() => (mode === ModifyType.New ? le("newEntry", "New entry") : le("modifyEntry", "Modify entry: {{entry.name}}", { entry }, false)), [entry, le, mode]);

    // Set the internal state entry.
    React.useEffect(() => {
        setEntryInternal(entry);
    }, [entry]);

    // After the component has been shown, focus the entry editor text box.
    const popupShown = React.useCallback(() => {
        focusTextBoxRef.current?.focus();
    }, []);

    // The OK button was clicked.
    const onOkClick = React.useCallback(() => {
        onClose(true, entryInternal);
    }, [entryInternal, onClose]);

    // The Cancel button was clicked.
    const onCancelClick = React.useCallback(() => {
        onClose(false);
    }, [onClose]);

    const afterOpenChange = React.useCallback(
        (open: boolean) => {
            if (open) {
                popupShown();
            }
        },
        [popupShown]
    );

    return (
        <Modal //
            title={title}
            open={visible}
            width={600}
            centered
            footer={null}
            onCancel={onCancelClick}
            afterOpenChange={afterOpenChange}
        >
            <div className={classNames(EditEntryPopup.name, className)}>
                <StyledEntryEditor //
                    className="Popup-entryEditor"
                    entry={entryInternal}
                    readOnly={false}
                    onEntryChanged={setEntryInternal}
                    showGeneratePassword={true}
                    nameTextBoxRef={focusTextBoxRef}
                    hideQrAuthPopup={!visible}
                    allTags={allTags}
                    showQrViewButton={false}
                    defaultUseMarkdown={defaultUseMarkdown}
                    defaultUseMonospacedFont={defaultUseMonospacedFont}
                    notesFont={notesFont}
                    useHtmlOnNotes={useHtmlOnNotes}
                    locale={locale}
                />
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

const StyledEditEntryPopup = styled(EditEntryPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
    .Popup-entryEditor {
        height: 100%;
        min-height: 0px;
    }
    .Popup-ButtonRow {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: flex-end;
    }
`;

export { StyledEditEntryPopup };
