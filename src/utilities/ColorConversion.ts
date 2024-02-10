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

/**
 * Converts an `rgb(r, g, b)` color value to hex notation. E.g. `#ffffff`.
 * @param {string} value The rgb value to convert to hex.
 * @param {string} fallbackValue The fallback value to return if the conversion fails.
 * @returns {string} A value representing the color in hex notation.
 */
const cssRgbToHex = (value: string, fallbackValue: string): string => {
    try {
        if (/#(\d|[A-Fa-f]){3,6}/.test(value)) {
            return value;
        }

        const valuesSplit = value.split("(")[1].split(")")[0];
        const components = valuesSplit.split(",");
        const result =
            "#" +
            components
                .map(f => {
                    const component = Number.parseInt(f).toString(16);
                    return component.length === 1 ? "0" + component : component;
                })
                .join("");

        return result;
    } catch {
        return fallbackValue;
    }
};

export { cssRgbToHex };
