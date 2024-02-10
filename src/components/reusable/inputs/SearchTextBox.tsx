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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useLocalize } from "../../../i18n";
import { CommonProps } from "../../Types";

export enum SearchMode {
    Or,
    And,
}

export type SearchTextBoxValue = {
    value: string;
    searchMode: SearchMode;
};

/**
 * The props for the {@link SearchTextBox} component.
 */
type SearchTextBoxProps = {
    /** The current value of the text box. */
    value: SearchTextBoxValue;
    /** Occurs when the {@link TextBox} value has been changed. */
    onValueChanged?: (value: SearchTextBoxValue) => void;
    /** Occurs when a key was pressed on the {@link TextBox}. */
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
} & CommonProps;

/**
 * A password input component with password generation possibility and copy to clipboard functionality.
 * @param param0 The component props: {@link SearchTextBoxProps}.
 * @returns A component.
 */
const SearchTextBox = ({
    className, //
    value,
    onValueChanged,
    onKeyDown,
}: SearchTextBoxProps) => {
    const lu = useLocalize("ui");

    // Memoize the tooltip for the password visibility toggle
    // button based on the value whether to display the password.
    const modeToggleHint = React.useMemo(() => {
        return value.searchMode === SearchMode.Or ? lu("orMode") : lu("andMode");
    }, [lu, value.searchMode]);

    const toggleMode = React.useCallback(() => {
        onValueChanged?.({ ...value, searchMode: value.searchMode === SearchMode.Or ? SearchMode.And : SearchMode.Or });
    }, [onValueChanged, value]);

    const clearClick = React.useCallback(() => {
        onValueChanged?.({ value: "", searchMode: value.searchMode });
    }, [onValueChanged, value.searchMode]);

    const textBoxValueChanged = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChanged?.({ value: e.target.value, searchMode: value.searchMode });
        },
        [onValueChanged, value.searchMode]
    );

    return (
        <div className={classNames(SearchTextBox.name, className)}>
            <div className="SearchTextBox-label">{lu("searchLabel")}</div>
            <Input //
                className="SearchTextBox-textBox"
                value={value.value}
                onChange={textBoxValueChanged}
                onKeyDown={onKeyDown}
            />
            <Tooltip title={modeToggleHint}>
                <Button //
                    className="SearchTextBox-buttonAndOr"
                    onClick={toggleMode}
                >{`${value.searchMode === SearchMode.Or ? "/" : "&"}`}</Button>
            </Tooltip>
            <Tooltip title={lu("clearSearch")}>
                <Button //
                    icon={<FontAwesomeIcon icon={faCircleXmark} />}
                    className="SearchTextBox-button"
                    onClick={clearClick}
                    disabled={value.value === ""}
                />
            </Tooltip>
        </div>
    );
};

const StyledSearchTextBox = styled(SearchTextBox)`
    display: flex;
    flex-direction: row;
    .SearchTextBox-textBox {
        width: 100%;
    }
    .SearchTextBox-button {
        margin-left: 6px;
        font-weight: bolder;
        width: 100px;
    }
    .SearchTextBox-buttonAndOr {
        margin-left: 6px;
        font-weight: bolder;
        width: 100px;
    }
    .SearchTextBox-label {
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        margin-right: 6px;
    }
`;

export { StyledSearchTextBox };
