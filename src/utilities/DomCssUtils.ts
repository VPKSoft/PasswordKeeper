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
