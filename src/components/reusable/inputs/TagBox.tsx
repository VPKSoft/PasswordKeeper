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
import { Select, SelectProps, Space, Tag } from "antd";
import classNames from "classnames";
import { CommonProps } from "../../Types";

/**
 * The props for the {@link TagBox} component.
 */
type TagBoxProps = {
    dataSource: string[] | undefined;
    readOnly: boolean | undefined;
    value: string[] | undefined;
    placeHolder?: string | undefined;
    onChange: (values: string[]) => void;
    onCustomItemCreating: (value: string) => void;
} & CommonProps;

/**
 * A component to allow tags to be assigned from existing collection or add new tags.
 * @param param0 The component props: {@link TagBoxProps}.
 * @returns A component.
 */
const TagBox = ({
    className, //
    dataSource,
    readOnly,
    value,
    placeHolder,
    onChange,
    onCustomItemCreating,
}: TagBoxProps) => {
    const options = React.useMemo(() => {
        const result: SelectProps["options"] = [];
        if (dataSource) {
            for (const f of dataSource) {
                result.push({ value: f, label: f });
            }
        }
        return result;
    }, [dataSource]);

    const handleChange = React.useCallback(
        (values: string[]) => {
            for (const value of values) {
                if (!dataSource?.some(f => f === value)) {
                    onCustomItemCreating(value.trim());
                }
            }
            onChange(values);
        },
        [dataSource, onChange, onCustomItemCreating]
    );

    if (readOnly) {
        return (
            <Space size={[0, 8]} wrap>
                {value?.map(f => <Tag key={f}>{f}</Tag>)}
            </Space>
        );
    }

    return (
        <Select //
            className={classNames(TagBox.name, className)}
            mode="tags"
            value={value ?? []}
            style={{ width: "100%" }}
            placeholder={placeHolder}
            onChange={handleChange}
            options={options}
        />
    );
};

export { TagBox };
