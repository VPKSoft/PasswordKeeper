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

import { invoke } from "@tauri-apps/api/core";
import * as React from "react";

/**
 * A custom hook to enumerate font families on the system and use some defaults as fallback.
 * @returns An array of font families.
 */
const useFontFamily = (): [Array<string>] => {
    const [fontFamilies, setFontFamilies] = React.useState<Array<string>>(fallbackFamilies);

    React.useEffect(() => {
        void invoke("get_font_families_data").then(values => {
            const valueResult = values as unknown as StringListResult;
            if (valueResult.error) {
                setFontFamilies(fallbackFamilies);
            } else {
                setFontFamilies(valueResult.value.length > 0 ? valueResult.value : fallbackFamilies);
            }
        });
    }, []);

    return [fontFamilies];
};

const fallbackFamilies = [
    "Arial",
    "Courier New",
    "Georgia",
    "Impact",
    "Lucida Console",
    "Tahoma",
    "Times New Roman",
    "Verdana",
];

type StringListResult = {
    value: Array<string>;
    error: boolean;
};

export { useFontFamily };
