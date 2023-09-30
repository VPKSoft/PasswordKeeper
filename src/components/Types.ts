/**
 * The common props for to be shared with among the components.
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

/** A type for the response of the OTPAuth one time key generation. */
export type Auth2Fa = {
    /** The name of the OTPAuth data for which the key was generated for. */
    name: string;
    /** The issuer of the OTPAuth data for which the key was generated for. */
    issuer: string;
    /** The one time key for the OTPAuth data. */
    key: string;
    /** A value indicating whether the key was successfully generated. */
    success: boolean;
};
