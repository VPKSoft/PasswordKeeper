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
import { marked } from "marked";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { CommonProps } from "../Types";

/**
 * The props for the {@link MarkDownView} component.
 */
type MarkDownViewProps = {
    // The markdown text to render into the component.
    markDown?: string;
} & CommonProps;

/**
 * A component to display markdown in React.
 * @param param0 The component props: {@link MarkDownViewProps}.
 * @returns A component.
 */
const MarkDownView = ({
    className, //
    markDown,
}: MarkDownViewProps) => {
    const markDownContent = React.useMemo(() => {
        if (!markDown) {
            return null;
        }

        const markDownAsHtml = DOMPurify.sanitize(marked.parse(markDown));
        return parse(markDownAsHtml);
    }, [markDown]);

    return (
        <div //
            className={classNames(MarkDownView.name, className)}
        >
            {markDownContent}
        </div>
    );
};

const MarkDownViewStyled = styled(MarkDownView)`
    width: 100%;
    height: 100%;
`;

export { MarkDownViewStyled };