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

import secureLocalStorage from "react-secure-storage";

/**
 * A custom hook to get, set and clear a secure value from the secureLocalStorage.
 * @param valueName The value name in question.
 * @param emptyValue An optional empty value used as a fallback in case the store value doesn't exist.
 * @returns Functions to set, get and clear the value in question.
 */
const useSecureStorage = <T extends string | number | boolean | object>(valueName: string, emptyValue?: T): [(value: T) => void, () => T | null, () => void] => {
    const setValue = (value: T) => {
        secureLocalStorage.setItem(valueName, value);
    };

    const getValue = () => {
        const result = secureLocalStorage.getItem(valueName) as T | null;

        return result ?? emptyValue ?? null;
    };

    const clear = () => {
        secureLocalStorage.removeItem(valueName);
    };

    return [setValue, getValue, clear];
};

export { useSecureStorage };
