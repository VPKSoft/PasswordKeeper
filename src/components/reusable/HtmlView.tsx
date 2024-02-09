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
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { CommonProps } from "../Types";

/**
 * The props for the {@link HtmlView} component.
 */
type HtmlViewProps = {
    /** The current value of the HTML in the viewer. */
    html?: string;
} & CommonProps;

/**
 * A component to view HTML securely by parsing sanitizing and parsing it to React first.
 * @param param0 The component props: {@link HtmlViewProps}.
 * @returns A HTML view component.
 */
const HtmlView = ({
    className, //
    html,
}: HtmlViewProps) => {
    const htmlReact = React.useMemo(() => {
        if (html) {
            const result = DOMPurify.sanitize(html);
            return parse(result);
        }
    }, [html]);

    return (
        <div //
            className={classNames(HtmlView.name, className)}
        >
            {htmlReact}
        </div>
    );
};

const HtmlViewStyled = styled(HtmlView)`
    width: 100%;
    height: 100%;
`;

export { HtmlViewStyled };
