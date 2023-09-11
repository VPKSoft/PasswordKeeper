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
import { ScrollView, TabPanel, TextArea } from "devextreme-react";
import { ValueChangedEvent } from "devextreme/ui/text_area";
import { Item as TabItem } from "devextreme-react/tab-panel";
import { CommonProps } from "../Types";
import { useLocalize } from "../../i18n";
import { MarkDownViewStyled } from "./MarkDownView";

/**
 * The props for the {@link MarkdownTextEditor} component.
 */
type MarkdownTextEditorProps = {
    markDown: string | undefined;
    setMarkDown: (value: string | undefined) => void;
} & CommonProps;

/**
 * A tabbed component for markdown editing and previewing.
 * @param param0 The component props: {@link MarkdownTextEditorProps}.
 * @returns A component.
 */
const MarkdownTextEditor = ({
    className, //
    markDown,
    setMarkDown,
}: MarkdownTextEditorProps) => {
    const le = useLocalize("entries");

    const onValueChanged = React.useCallback(
        (e: ValueChangedEvent) => {
            setMarkDown(e.value);
        },
        [setMarkDown]
    );

    return (
        <TabPanel //
            className={classNames(MarkdownTextEditor.name, className)}
        >
            <TabItem //
                title={le("entryNotesEdit")}
            >
                <TextArea //
                    className="Editor-textArea"
                    readOnly={false}
                    value={markDown}
                    onValueChanged={onValueChanged}
                />
            </TabItem>
            <TabItem //
                title={le("entryNotesPreview")}
            >
                <ScrollView>
                    <MarkDownViewStyled markDown={markDown} />
                </ScrollView>
            </TabItem>
        </TabPanel>
    );
};

const MarkdownTextEditorStyled = styled(MarkdownTextEditor)`
    .Editor-textArea {
        height: 100%;
    }
`;

export { MarkdownTextEditorStyled };