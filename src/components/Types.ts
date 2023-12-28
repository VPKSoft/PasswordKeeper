/**
 * The common props for to be shared with among the components.
 */
type CommonProps = {
    /** The HTML class attribute. */
    className?: string;
};

/** A type for the response of the OTPAuth one time key generation. */
type Auth2Fa = {
    /** The name of the OTPAuth data for which the key was generated for. */
    name: string;
    /** The issuer of the OTPAuth data for which the key was generated for. */
    issuer: string;
    /** The one time key for the OTPAuth data. */
    key: string;
    /** A value indicating whether the key was successfully generated. */
    success: boolean;
    /** An error message if an error occurred in key generation. */
    error_message: string;
};

export type { CommonProps, Auth2Fa };
