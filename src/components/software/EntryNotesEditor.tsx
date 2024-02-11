import * as React from "react";
import { styled } from "styled-components";
import classNames from "classnames";
import { CommonProps } from "../Types";
import { DataEntry } from "../../types/PasswordEntry";
import { MarkDownViewStyled } from "../reusable/MarkDownView";
import { MarkdownTextEditorStyled } from "../reusable/MarkdownTextEditor";
import { HtmlViewStyled } from "../reusable/HtmlView";
import { HtmlEditorStyled } from "../reusable/HtmlEditor";
import { Locales } from "../../i18n";
import { EntryEditorTextAreaStyled } from "./EntryEditorTextArea";

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
    /** A value indicating whether to use RichText(HTML) by default in the notes editor. */
    defaultUseHtml?: boolean;
    /** A value indicating whether to use monospaced font by default in the notes editor. */
    defaultUseMonospacedFont?: boolean;
    /** A value indicating whether the Markdown image pasting is enabled. **Disable if clipboard is being listened elsewhere.** */
    imagePasteEnabled: boolean;
    /** Height for the control via style. */
    height?: string | undefined | null;
    /** The current application locale used by the i18next library. */
    locale: Locales;
    /** Occurs when the notes value has been changed. */
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
    defaultUseHtml,
    defaultUseMonospacedFont,
    imagePasteEnabled,
    height,
    locale,
    onNotesChanged,
}: EntryNotesEditorProps) => {
    const monoSpacedFont = React.useMemo(() => {
        return entry?.useMonospacedFont ?? defaultUseMonospacedFont ?? false;
    }, [defaultUseMonospacedFont, entry?.useMonospacedFont]);

    // The item notes was changed.
    const onNotesChangedCallback = React.useCallback(
        (value: string | undefined) => {
            onNotesChanged(value);
        },
        [onNotesChanged]
    );

    const content = React.useMemo(() => {
        if (defaultUseHtml === true) {
            return readOnly ? (
                <HtmlViewStyled //
                    html={entry?.notes}
                    className="EntryNotesEditor-TextArea"
                />
            ) : (
                <HtmlEditorStyled //
                    value={entry?.notes}
                    onChange={onNotesChanged}
                    className="EntryNotesEditor-TextArea"
                    height={height ?? "240px"}
                    locale={locale}
                />
            );
        }

        if ((entry?.useMarkdown ?? defaultUseMarkdown) === true) {
            return readOnly ? (
                <MarkDownViewStyled //
                    className="EntryNotesEditor-TextArea"
                    markDown={entry?.notes}
                    monospacedFont={monoSpacedFont}
                />
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
    }, [defaultUseHtml, entry?.useMarkdown, entry?.notes, defaultUseMarkdown, readOnly, onNotesChangedCallback, monoSpacedFont, onNotesChanged, height, imagePasteEnabled]);

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
        height: ${props => (props.defaultUseHtml === true ? "240px" : "100%")};
        min-height: ${props => props.height ?? "240px"};
        resize: none;
        overflow: auto;
    }
`;

export { EntryNotesEditorStyled };
