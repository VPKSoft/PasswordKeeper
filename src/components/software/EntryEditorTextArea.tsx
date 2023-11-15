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
import { styled } from "styled-components";
import classNames from "classnames";
import TextArea from "devextreme-react/text-area";
import { ValueChangedEvent } from "devextreme/ui/text_area";
import { CommonProps } from "../Types";

/**
 * The props for the {@link EntryEditorTextArea} component.
 */
type EntryEditorTextAreaProps = {
    /** A value indicating whether the editor is in read-only mode. E.g. display item mode. */
    readOnly: boolean | undefined;
    /** The current value of the text editor. */
    value: string | undefined;
    /** A value indicating whether to use monospaced font in the markdown editor. */
    monospacedFont?: boolean;
    /** Occurs when the {@link EntryEditorTextArea} value has been changed. */
    onValueChanged?: (e: ValueChangedEvent) => void;
} & CommonProps;

/**
 * A component for editing and viewing plain text notes.
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
