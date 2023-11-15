import * as React from "react";
import { styled } from "styled-components";
import classNames from "classnames";
import { ScrollView } from "devextreme-react";
import { ValueChangedEvent as TextBoxValueChangedEvent } from "devextreme/ui/text_box";
import { CommonProps } from "../Types";
import { DataEntry } from "../../types/PasswordEntry";
import { MarkDownViewStyled } from "../reusable/MarkDownView";
import { MarkdownTextEditorStyled } from "../reusable/MarkdownTextEditor";
import { EntryEditorTextAreaStyled } from "./EntryEditorTextArea";
import { EntryEditorHtmlAreaStyled } from "./EntryEditorHtmlArea";

/**
 * The props for the {@link EntryNotesEditor} component.
 */
type EntryNotesEditorProps = {
    /** The current {@link DataEntry} value which is an item, NOT a category. */
    entry?: DataEntry | null;
    /** A value indicating whether the editor is in read-only mode. E.g. display item mode. */
    readOnly?: boolean;
    /** A value indicating whether to use Markdown by default in the notes editor. */
    defaultUseMarkdown?: boolean;
    /** A value indicating whether to use monospaced font by default in the notes editor. */
    defaultUseMonospacedFont?: boolean;
    /** A value indicating whether to use HTML on entry editing and rendering. */
    useHtmlOnNotes?: boolean;
    /** A value indicating whether the Markdown image pasting is enabled. **Disable if clipboard is being listened elsewhere.** */
    imagePasteEnabled: boolean;
    onNotesChanged: (value: string | undefined) => void;
} & CommonProps;

/**
 * A  component ...
 * @param param0 The component props: {@link EntryNotesEditorProps}.
 * @returns A component.
 */
const EntryNotesEditor = ({
    className, //
    entry,
    readOnly = true,
    defaultUseMarkdown,
    defaultUseMonospacedFont,
    useHtmlOnNotes,
    imagePasteEnabled,
    onNotesChanged,
}: EntryNotesEditorProps) => {
    const monoSpacedFont = React.useMemo(() => {
        return entry?.useMonospacedFont ?? defaultUseMonospacedFont ?? false;
    }, [defaultUseMonospacedFont, entry?.useMonospacedFont]);

    // The item notes was changed.
    const onNotesChangedCallback = React.useCallback(
        (e: TextBoxValueChangedEvent) => {
            onNotesChanged(e.value);
        },
        [onNotesChanged]
    );

    const content = React.useMemo(() => {
        if (useHtmlOnNotes) {
            return (
                <EntryEditorHtmlAreaStyled //
                    readOnly={readOnly}
                    value={entry?.notes}
                    className={classNames("EntryNotesEditor-TextArea")}
                    onValueChanged={onNotesChanged}
                    monospacedFont={monoSpacedFont}
                />
            );
        }

        if ((entry?.useMarkdown ?? defaultUseMarkdown) === true) {
            return readOnly ? (
                <ScrollView //
                    className="EntryNotesEditor-TextArea"
                >
                    <MarkDownViewStyled //
                        markDown={entry?.notes}
                        monospacedFont={monoSpacedFont}
                    />
                </ScrollView>
            ) : (
                <MarkdownTextEditorStyled //
                    markDown={entry?.notes}
                    setMarkDown={onNotesChanged}
                    monospacedFont={monoSpacedFont}
                    className="EntryNotesEditor-TextArea"
                    imagePasteEnabled={imagePasteEnabled}
                />
            );
        }

        return (
            <EntryEditorTextAreaStyled //
                readOnly={readOnly}
                value={entry?.notes}
                className={classNames("EntryNotesEditor-TextArea")}
                onValueChanged={onNotesChangedCallback}
                monospacedFont={monoSpacedFont}
            />
        );
    }, [defaultUseMarkdown, entry?.notes, entry?.useMarkdown, imagePasteEnabled, monoSpacedFont, onNotesChanged, onNotesChangedCallback, readOnly, useHtmlOnNotes]);

    return (
        <div //
            className={classNames(EntryNotesEditor.name, className)}
        >
            {content}
        </div>
    );
};

const EntryNotesEditorStyled = styled(EntryNotesEditor)`
    display: flex;
    flex-direction: column;
    min-height: 0;
    width: 100%;
    height: 100%;
    .EntryNotesEditor-TextArea {
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
        height: 100%;
        min-height: 0px;
    }
`;

export { EntryNotesEditorStyled };
