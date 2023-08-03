// Original copyright, MIT (C): krissrex, https://github.com/krissrex/google-authenticator-exporter/blob/master/src/index.js
import * as protobuf from "protobufjs";
import { Buffer } from "buffer/";
import { base32 } from "./edbase32";

const proto = `
// LICENSE: GNU General Public License v3.0 to Beem Development (https://github.com/beemdevelopment)
// From https://github.com/beemdevelopment/Aegis/pull/406/files#diff-410b85c0f939a198f70af5fc855a21ed
// Changes: modified package name.

syntax = "proto3";

package googleauth;

message MigrationPayload {
  enum Algorithm {
    ALGO_INVALID = 0;
    ALGO_SHA1 = 1;
  }

  enum OtpType {
    OTP_INVALID = 0;
    OTP_HOTP = 1;
    OTP_TOTP = 2;
  }

  message OtpParameters {
    bytes secret = 1;
    string name = 2;
    string issuer = 3;
    Algorithm algorithm = 4;
    int32 digits = 5;
    OtpType type = 6;
    int64 counter = 7;
  }

  repeated OtpParameters otp_parameters = 1;
  int32 version = 2;
  int32 batch_size = 3;
  int32 batch_index = 4;
  int32 batch_id = 5;
}
`;

/**
 * Google Authenticator uses protobuff to encode the 2fa data.
 *
 * @param {Uint8Array} payload
 */
const decodeProtobuf = async (payload: Uint8Array) => {
    const root = protobuf.parse(proto, { keepCase: true }).root;

    const MigrationPayload = root.lookupType("googleauth.MigrationPayload");

    const message = MigrationPayload.decode(payload);

    return MigrationPayload.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
    });
};

/**
 * Convert a base64 to base32.
 * Most Time based One Time Password (TOTP)
 * password managers use this as the "secret key" when generating a code.
 *
 * An example is: https://totp.danhersam.com/.
 *
 * @returns RFC3548 compliant base32 string
 */
const toBase32 = (base64String: string) => {
    try {
        const raw = Buffer.from(base64String, "base64");
        return base32.encode(raw) ?? "";
    } catch {
        return "";
    }
};

type OtpData = {
    secret: string;
    name: string;
    issuer: string;
    algorithm: string;
    digits: number;
    type: string;
};

type OtpDataWithBase32 = {
    secretBase32: string;
} & OtpData;

/**
 * The data in the URI from Google Authenticator
 *  is a protobuff payload which is Base64 encoded and then URI encoded.
 * This function decodes those, and then decodes the protobuf data contained inside.
 *
 * @param {String} data the `data` query parameter from the totp migration string that google authenticator outputs.
 */
const decode = async (data: string) => {
    //const buffer = Buffer.from(decodeURIComponent(data), "base64");
    const buffer = Buffer.from(data, "base64");

    const payload = await decodeProtobuf(buffer);

    const typedPayload = payload as { otp_parameters: OtpData[] };

    const accounts = typedPayload.otp_parameters.map((f: OtpData) => {
        const result: OtpDataWithBase32 = { ...f, secretBase32: toBase32(f.secret) };

        return result;
    });

    return accounts;
};

/**
 * Generates an OTPAuth URI from the specified {@link OtpDataWithBase32}.
 * @param {OtpDataWithBase32} otpData The decoded OTP data toi generate the URI from.
 * @param {boolean} useBase32Secret A value indicating whether to use the plain text or the Base32 secret in the URI.
 * @returns An `otpauth://` URI generated from the specified {@link OtpDataWithBase32} otpData.
 */
const makeOtpAuthKey = (otpData: OtpDataWithBase32, useBase32Secret: boolean = true) => {
    // TODO::Proper URI builder for OTP!
    return `otpauth://totp/${otpData.name}?secret=${useBase32Secret ? otpData.secretBase32 : otpData.secret}&issuer=${otpData.issuer}`;
};

export type { OtpDataWithBase32 };

export { decode, makeOtpAuthKey };
