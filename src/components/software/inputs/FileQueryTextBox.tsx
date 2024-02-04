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

import classNames from "classnames";
import * as React from "react";
import { styled } from "styled-components";
import { Button, Input, Tooltip } from "antd";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocalize } from "../../../i18n";
import { selectFileToOpen, selectFileToSave } from "../../../utilities/app/Files";
import { FileQueryMode } from "../../../types/Enums";
import { CommonProps } from "../../Types";

/**
 * The props for the {@link FileQueryTextBox} component.
 */
type FileQueryTextBoxProps = {
    /** The textbox value (the file name). */
    value?: string | undefined;
    /** The mode the query the file name in. */
    mode: FileQueryMode;
    /** Occurs when the value of the file name has been changed. */
    onValueChanged: (value: string | undefined) => void;
    /** Occurs when a key was pressed in the file name edit text box.  */
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
} & CommonProps;

/**
 * A component for inputting a file name in either open, save or save as mode.
 * @param param0 The component props: {@link FileQueryTextBoxProps}.
 * @returns A component.
 */
const FileQueryTextBox = ({
    className, //
    value,
    mode,
    onValueChanged,
    onKeyDown,
}: FileQueryTextBoxProps) => {
    const lc = useLocalize("common");
    const la = useLocalize("app");

    // A callback for select file click. Depending on the mode use the appropriate dialog;
    // save or open file dialog.
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
        <div className={classNames(FileQueryTextBox.name, className)}>
            <Input //
                readOnly={true}
                className="FileQueryTextbox-textBox"
                value={value}
                onKeyDown={onKeyDown}
            />
            <Tooltip title={lc("selectFileOpen")}>
                <Button //
                    icon={<FontAwesomeIcon icon={faFolderOpen} />}
                    className="FileQueryTextbox-button"
                    onClick={selectFileClick}
                />
            </Tooltip>
        </div>
    );
};

const StyledFileQueryTextBox = styled(FileQueryTextBox)`
    display: flex;
    flex-direction: row;
    .FileQueryTextbox-textBox {
        width: 100%;
    }
    .FileQueryTextbox-button {
        margin-left: 6px;
    }
`;

export { StyledFileQueryTextBox };
