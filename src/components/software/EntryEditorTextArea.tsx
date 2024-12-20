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

import { Input } from "antd";
import classNames from "classnames";
import * as React from "react";
import { styled } from "styled-components";
import type { CommonProps } from "../Types";

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
    onValueChanged?: (value: string | undefined) => void;
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
    onValueChanged,
}: EntryEditorTextAreaProps) => {
    const onChange = React.useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onValueChanged?.(e.target.value);
        },
        [onValueChanged]
    );

    return (
        <Input.TextArea //
            readOnly={readOnly}
            value={value}
            className={classNames(EntryEditorTextArea.name, className)}
            onChange={onChange}
        />
    );
};

const EntryEditorTextAreaStyled = styled(EntryEditorTextArea)`
    // Use the &&-block to not to allow the style being overridden by specifying the className prop.
    && {
        font-family: ${props => (props.monospacedFont === true ? "monospace" : "system-ui")};
    }
`;

export { EntryEditorTextAreaStyled };
