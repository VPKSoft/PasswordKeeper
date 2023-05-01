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

type RuleExtended = CSSRule & CSSStyleRule;

type Indexable = {
    [key: string]: string | null | undefined;
};

/**
 * Gets the @see Document CSS style property value.
 * @param styleName The style class name.
 * @param styleProp The style class property name.
 * @param fallBack The fallback value for the @param styleProp value if one is not found.
 * @returns A CSS style property value as string.
 */
export const styleRuleValue = (styleName: string, styleProp: string, fallBack: string | undefined) => {
    for (let i = 0; i < document.styleSheets.length; i++) {
        const docSheets = document.styleSheets[i];
        const sheetRules = docSheets.cssRules;

        for (const sheetRule of sheetRules) {
            const ruleExt = sheetRule as RuleExtended;

            if (ruleExt && ruleExt.selectorText) {
                const classNames = ruleExt.selectorText.split(" ");
                if (classNames.includes(styleName)) {
                    return (ruleExt.style as unknown as Indexable)[styleProp] ?? fallBack;
                }
            }
        }
    }

    return fallBack;
};
