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
import * as React from "react";

/**
 * A custom hook to get CSS style property **computed** value of the specified class names.
 * @param {string} styleProp The CSS property name which computed value to get.
 * @param {T} fallbackValue A fallback value for the result.
 * @param processConvertFunc An optional callback to do some processing and type conversion to other than string value for the **computed** CSS property value before returning the value.
 * @param args A list of class names to use for the style property value.
 * @returns {string} The **computed** CSS property value.
 * @throws Error: `The processConvertFunc must be defined when the result type is other than string.` if the result type is other than `string` and no {@link processConvertFunc} is defined.
 */
const useGetCssStyle = <T = string>(styleProp: keyof CSSStyleDeclaration, fallbackValue: T, processConvertFunc: ((value: T) => T) | null, ...args: classNames.ArgumentArray): T => {
    const [result, setResult] = React.useState<T>(fallbackValue);

    React.useEffect(() => {
        const div = document.createElement("div");
        div.className = classNames(args);
        document.head.append(div);
        const resultValue = window.getComputedStyle(div)[styleProp]?.toString() ?? fallbackValue;
        div.remove();
        if (typeof fallbackValue !== "string" && !processConvertFunc) {
            throw new Error("The processConvertFunc must be defined when the result type is other than string.");
        } else if (typeof fallbackValue === "string" && !processConvertFunc) {
            setResult(resultValue as T);
        } else if (processConvertFunc) {
            setResult(processConvertFunc(resultValue as T));
        }
    }, [args, processConvertFunc, fallbackValue, styleProp]);

    return result;
};

export { useGetCssStyle as useCssStyle };
