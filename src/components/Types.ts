/**
 * The common props for to be shared with am ong the components.
 */
export type CommonProps = {
    /** The HTML class attribute. */
    className?: string;
};

type DxFilterExpression = "=" | "<>" | "<" | ">" | "<=" | ">=" | "between" | "contains" | "notcontains" | "startswith" | "endswith" | "anyof" | "noneof";
type DxFilterPart<T> = [keyof T, DxFilterExpression, string | boolean | number];
type DxFilterCombination = "and" | "or";

/**
 * Typed DevExtreme filter.
 */
export type DxFilter<T> = Array<DxFilterPart<T> | DxFilterCombination | DxFilter<T>>;
