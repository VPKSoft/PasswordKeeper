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
import { ValueChangedEvent } from "devextreme/ui/html_editor";
import ScrollView from "devextreme-react/scroll-view";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { CommonProps } from "../Types";
import { HtmlEditor } from "../compound/HtmlEditorCompound";
import { useFontFamily } from "../../hooks/UseFontFamily";

/**
 * The props for the {@link EntryEditorHtmlArea} component.
 */
type EntryEditorHtmlAreaProps = {
    /** A value indicating whether the editor is in read-only mode. E.g. display item mode. */
    readOnly: boolean | undefined;
    /** The current value of the HTML editor. */
    value: string | undefined;
    /** A value indicating whether to use monospaced font in the markdown editor. */
    monospacedFont?: boolean;
    /** Occurs when the {@link EntryEditorHtmlArea} value has been changed. */
    onValueChanged?: (e: string | undefined) => void;
} & CommonProps;

/**
 * A component for editing and viewing HTML text notes.
 * @param param0 The component props: {@link EntryEditorHtmlAreaProps}.
 * @returns A component.
 */
const EntryEditorHtmlArea = ({
    className, //
    readOnly,
    value,
    monospacedFont,
    onValueChanged,
}: EntryEditorHtmlAreaProps) => {
    const [fontFamilies] = useFontFamily();

    // For unresolved reason the prop does not affect if used directly with styled components.
    // This is possibly a DevExtreme bug with the TextArea component.
    const style = React.useMemo(() => {
        return { fontFamily: monospacedFont === true ? "monospace" : "system-ui" };
    }, [monospacedFont]);

    const onValueChangedCallback = React.useCallback(
        (e: ValueChangedEvent) => {
            onValueChanged?.(e.value);
        },
        [onValueChanged]
    );

    const htmlReadOnly = React.useMemo(() => {
        if (readOnly && value) {
            const result = DOMPurify.sanitize(value);
            return parse(result);
        }
    }, [readOnly, value]);

    return readOnly ? (
        <ScrollView //
            className="EntryEditorHtmlArea-TextArea"
        >
            <div>{htmlReadOnly}</div>
        </ScrollView>
    ) : (
        <HtmlEditor //
            style={style}
            readOnly={readOnly}
            value={value}
            valueType="html"
            className={classNames(EntryEditorHtmlArea.name, className, "EntryEditorHtmlArea-TextArea")}
            onValueChanged={onValueChangedCallback}
        >
            <HtmlEditor.Toolbar>
                <HtmlEditor.Toolbar.Item name="undo" />
                <HtmlEditor.Toolbar.Item name="redo" />
                <HtmlEditor.Toolbar.Item name="separator" />
                <HtmlEditor.Toolbar.Item name="header" acceptedValues={headerValues} options={headerOptions} />
                <HtmlEditor.Toolbar.Item name="size" acceptedValues={sizeValues} options={headerOptions} />
                <HtmlEditor.Toolbar.Item name="font" acceptedValues={fontFamilies} options={headerOptions} />
                <HtmlEditor.Toolbar.Item name="bold" />
                <HtmlEditor.Toolbar.Item name="italic" />
                <HtmlEditor.Toolbar.Item name="strike" />
                <HtmlEditor.Toolbar.Item name="underline" />
                <HtmlEditor.Toolbar.Item name="separator" />
                <HtmlEditor.Toolbar.Item name="alignLeft" />
                <HtmlEditor.Toolbar.Item name="alignCenter" />
                <HtmlEditor.Toolbar.Item name="alignRight" />
                <HtmlEditor.Toolbar.Item name="alignJustify" />
                <HtmlEditor.Toolbar.Item name="separator" />
                <HtmlEditor.Toolbar.Item name="color" />
                <HtmlEditor.Toolbar.Item name="background" />
                <HtmlEditor.Toolbar.Item name="image" />
                <HtmlEditor.Toolbar.Item name="separator" />
                <HtmlEditor.Toolbar.Item name="bulletList" />
                <HtmlEditor.Toolbar.Item name="orderedList" />
            </HtmlEditor.Toolbar>
        </HtmlEditor>
    );
};

const headerValues = [false, 1, 2, 3, 4, 5];
const sizeValues = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
const headerOptions = { inputAttr: { "aria-label": "Header" } };

const EntryEditorHtmlAreaStyled = styled(EntryEditorHtmlArea)`
    .EntryEditorHtmlArea-TextArea {
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100%;
        height: 100%;
        min-height: 0px;
    }
`;

export { EntryEditorHtmlAreaStyled };
