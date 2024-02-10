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
import JoditEditor from "jodit-react";
import { Jodit } from "jodit/esm/jodit";
import { CommonProps } from "../Types";
import { useFontFamily } from "../../hooks/UseFontFamily";

/**
 * The props for the {@link HtmlEditor} component.
 */
type HtmlEditorProps = {
    onChange: (value: string) => void;
    value: string | undefined;
    height?: string | number;
} & CommonProps;

/**
 * A component for editing HTML rich text using [Jodit](https://github.com/xdan/jodit) as the editor component.
 * @param param0 The component props: {@link HtmlEditorProps}.
 * @returns A HTML editor component.
 */
const HtmlEditor = ({
    className, //
    value,
    height,
    onChange,
}: HtmlEditorProps) => {
    const editor = React.useRef<Jodit>(null);
    const [fontFamilies] = useFontFamily();

    const fontsObject = React.useMemo(() => {
        const joditFamilies: { [key: string]: string } = {};
        for (const f of fontFamilies) {
            joditFamilies[f] = f;
        }

        return joditFamilies;
    }, [fontFamilies]);

    const joditConfig = React.useMemo(() => {
        return {
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            placeholder: "",
            controls: {
                font: {
                    list: Jodit.atom({
                        ...fontsObject,
                    }),
                },
            },
            height: height,
            uploader: {
                insertImageAsBase64URI: true,
            },
            toolbarInlineForSelection: false,
            showPlaceholder: false,
            toolbarAdaptive: false,
            buttons: joditButtons,
            toolbarInline: false,
        };
    }, [fontsObject, height]);

    return (
        <div className={classNames(HtmlEditor.name, className)}>
            <JoditEditor
                ref={editor}
                value={value ?? ""}
                config={joditConfig}
                onBlur={onChange} // preferred to use only this option to update the content for performance reasons
                onChange={emptyFunc}
            />
        </div>
    );
};

const joditButtons = [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "eraser",
    "ul",
    "ol",
    "font",
    "fontsize",
    "paragraph",
    "superscript",
    "subscript",
    "image",
    "table",
    "link",
    "indent",
    "outdent",
];

const emptyFunc = () => {};

const HtmlEditorStyled = styled(HtmlEditor)`
    width: 100%;
    height: 100%;
    .jodit-react-container {
        overflow: auto;
    }
    .jodit-editor__resize {
        display: none;
    }
    .jodit-status-bar-link {
        display: none;
    }
`;

export { HtmlEditorStyled };
