import * as React from "react";
import { styled } from "styled-components";
import classNames from "classnames";
import TextArea from "devextreme-react/text-area";
import { ValueChangedEvent } from "devextreme/ui/text_area";
import { CommonProps } from "../Types";

/**
 * The props for the {@link EntryEditorTextArea} component.
 */
type EntryEditorTextAreaProps = {
    readOnly: boolean | undefined;
    value: string | undefined;
    /** A value indicating whether to use monospaced font in the markdown editor. */
    monospacedFont?: boolean;
    onValueChanged?: (e: ValueChangedEvent) => void;
} & CommonProps;

/**
 * A component for editing anf viewing plain text notes.
 * @param param0 The component props: {@link EntryEditorTextAreaProps}.
 * @returns A component.
 */
const EntryEditorTextArea = ({
    className, //
    readOnly,
    value,
    monospacedFont,
    onValueChanged,
}: EntryEditorTextAreaProps) => {
    // For unresolved reason the prop does not affect if used directly with styled components.
    // This is possibly a DevExtreme bug with the TextArea component.
    const style = React.useMemo(() => {
        return { fontFamily: monospacedFont === true ? "monospace" : "system-ui" };
    }, [monospacedFont]);

    return (
        <TextArea //
            style={style}
            readOnly={readOnly}
            value={value}
            className={classNames(EntryEditorTextArea.name, className)}
            onValueChanged={onValueChanged}
        />
    );
};

const EntryEditorTextAreaStyled = styled(EntryEditorTextArea)`
    // Add style(s) here
`;

export { EntryEditorTextAreaStyled };
