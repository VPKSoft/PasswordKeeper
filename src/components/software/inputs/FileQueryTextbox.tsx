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

import classNames from "classnames";
import Button from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import * as React from "react";
import styled from "styled-components";
import { InitializedEvent, KeyDownEvent } from "devextreme/ui/text_box";
import { useLocalize } from "../../../i18n";
import { selectFileToOpen, selectFileToSave } from "../../../utilities/app/Files";
import { FileQueryMode } from "../../../types/Enums";

type Props = {
    className?: string;
    value?: string | undefined;
    mode: FileQueryMode;
    onValueChanged: (value: string | undefined) => void;
    onKeyDown?: (e: KeyDownEvent) => void;
    onInitialized?: (e: InitializedEvent) => void;
};

const FileQueryTextbox = ({
    className, //
    value,
    mode,
    onValueChanged,
    onKeyDown,
    onInitialized,
}: Props) => {
    const lc = useLocalize("common");
    const la = useLocalize("app");

    const selectFileClick = React.useCallback(() => {
        if (mode === FileQueryMode.Open) {
            void selectFileToOpen(la("passwordKeeperDataFile", "PasswordKeeper data file")).then(f => {
                if (f !== null) {
                    onValueChanged(f);
                }
            });
        } else {
            void selectFileToSave(la("passwordKeeperDataFile", "PasswordKeeper data file")).then(f => {
                if (f !== null) {
                    onValueChanged(f);
                }
            });
        }
    }, [la, mode, onValueChanged]);

    return (
        <div className={classNames(FileQueryTextbox.name, className)}>
            <TextBox //
                readOnly={true}
                className="FileQueryTextbox-textBox"
                value={value}
                onKeyDown={onKeyDown}
                onInitialized={onInitialized}
            />
            <Button //
                icon="activefolder"
                className="FileQueryTextbox-button"
                onClick={selectFileClick}
                hint={lc("selectFileOpen")}
            />
        </div>
    );
};

export default styled(FileQueryTextbox)`
    display: flex;
    flex-direction: row;
    .FileQueryTextbox-textBox {
        width: 100%;
    }
    .FileQueryTextbox-button {
        margin-left: 6px;
    }
`;
