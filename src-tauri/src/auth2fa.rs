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

use serde_derive::{Deserialize, Serialize};
use totp_rs::TOTP;

/// A `struct` for response of the OTPAuth one time key generation.
#[derive(Debug, Serialize, Deserialize)]
pub struct Auth2FAResult {
    /// The name of the OTPAuth data for which the key was generated for.
    name: String,
    /// The issuer of the OTPAuth data for which the key was generated for.
    issuer: String,
    /// The one time key for the OTPAuth data.
    key: String,
    /// A value indicating whether the key was successfully generated.
    success: bool,
    /// An error message if an error occurred in key generation.
    error_message: String,
}

// The default value for the Auth2FAResult struct.

/// The default implementation for the `Auth2FAResult` `struct`.
impl ::std::default::Default for Auth2FAResult {
    /// The default value for the `Auth2FAResult` `struct`.
    /// # Arguments
    ///
    /// # Returns
    /// The default value for the `Auth2FAResult` `struct`.    
    fn default() -> Self {
        Self {
            name: "".to_string(),
            issuer: "".to_string(),
            key: "".to_string(),
            success: true,
            error_message: "".to_string(),
        }
    }
}

///  Returns a default error value for the `Auth2FAResult` `struct`.
///
/// # Arguments
/// * `error_message` - Error message for the error which occurred during the TOTP generation.
///
/// # Returns
/// a default error value for the `Auth2FAResult` `struct`.
fn aut_error(error_message: String) -> Auth2FAResult {
    let result = Auth2FAResult {
        name: "".to_string(),
        issuer: "".to_string(),
        key: "".to_string(),
        success: false,
        error_message: error_message,
    };

    result
}

/// Generates a `Auth2FAResult` value from the specified OTPAuth URL.
/// # Arguments
///
/// * `otpauth` - The OTPAuth URL.
///
/// # Returns
/// An `Auth2FAResult` `struct` value.
///
/// # Remarks
/// * In case of error the the `Auth2FAResult.success` value is set to `false`.
pub fn gen_secret_otpauth(otpauth: String) -> Auth2FAResult {
    // The unchecked version accepts other than minimum of 128-bit secrets,
    // which is a requirement of the RFC6238 standard.
    let auth = TOTP::from_url_unchecked(otpauth);

    // Validate the TOTP generation first.
    let result = match auth {
        Ok(v) => {
            // The TOTP was generated successfully, generate the key second.
            let totp = v.generate_current();

            // Validate the key generation.
            let auth_result = match totp {
                Ok(totp_value) => {
                    let auth_result = Auth2FAResult {
                        name: v.account_name.to_string(),
                        // Check if there is an issuer defined, otherwise set the issuer into an empty string.
                        issuer: match v.issuer {
                            None => "".to_string(),
                            Some(v) => v,
                        },
                        key: totp_value,
                        success: true,
                        error_message: "".to_string(),
                    };

                    auth_result
                }
                // The key generation failed.
                Err(e) => aut_error(e.to_string()),
            };

            auth_result
        }
        // The TOTP creation failed.
        Err(e) => aut_error(e.to_string()),
    };

    result
}
