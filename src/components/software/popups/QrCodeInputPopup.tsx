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

import * as React from "react";
import { styled } from "styled-components";
import classNames from "classnames";
import { Button, Popup } from "devextreme-react";
import { Html5Qrcode } from "html5-qrcode/esm/html5-qrcode";
import { invoke } from "@tauri-apps/api/tauri";
import notify from "devextreme/ui/notify";
import { decodeMigrationUriData, makeOtpAuthKey } from "gauth-decode";
import { Auth2Fa, CommonProps } from "../../Types";
import { DragDropFileStyled } from "../../reusable/DragDropFile";
import { useLocalize } from "../../../i18n";

/**
 * The props for the {@link QrCodeInputPopup} component.
 */
type QrCodeInputPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    onClose: (userAccepted: boolean, otpAuthKey?: string | undefined) => void;
} & CommonProps;

/**
 * A popup component for querying the a QR code image from the user.
 * @param param0 The component props: {@link QrCodeInputPopupProps}.
 * @returns A component.
 */
const QrCodeInputPopup = ({
    className, //
    visible,
    onClose,
}: QrCodeInputPopupProps) => {
    const [userAccepted, setUserAccepted] = React.useState(false);
    const [otpAuthPath, setOtpAuthPath] = React.useState("");

    const lm = useLocalize("messages");
    const lu = useLocalize("ui");

    // Handle the onVisibleChange callback of the Popup component.
    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onClose(userAccepted, userAccepted ? otpAuthPath : undefined);
            }
            setUserAccepted(false);
            setOtpAuthPath("");
        },
        [onClose, otpAuthPath, userAccepted]
    );

    // Handle the onHiding callback of the Popup component.
    const onHiding = React.useCallback(() => {
        onClose(userAccepted, userAccepted ? otpAuthPath : undefined);
        setOtpAuthPath("");
        setUserAccepted(false);
    }, [onClose, otpAuthPath, userAccepted]);

    const onFilesUpdated = React.useCallback(
        (e: File | File[]) => {
            const scanner = new Html5Qrcode("reader");
            const file = Array.isArray(e) ? e[0] : e;

            scanner
                .scanFile(file, false)
                .then((decodedText: string) => {
                    if (decodedText.startsWith("otpauth-migration")) {
                        try {
                            const queryParams = new URL(decodedText).search;
                            const data = new URLSearchParams(queryParams).get("data");
                            if (data) {
                                void decodeMigrationUriData(data).then(otpData => {
                                    if (otpData.length > 0) {
                                        setOtpAuthPath(makeOtpAuthKey(otpData[0]));
                                        if (otpData.length !== 1) {
                                            notify(lm("qrMoreThan1"), "warning", 5_000);
                                        }
                                        notify(lm("qrSuccess"), "success", 5_000);
                                    } else {
                                        notify(lm("otpAuthKeyGenFailed"), "error", 5_000);
                                    }
                                });
                            } else {
                                notify(lm("otpAuthKeyGenFailed"), "error", 5_000);
                            }
                        } catch {
                            notify(lm("otpAuthKeyGenFailed"), "error", 5_000);
                        }
                    } else {
                        void invoke<Auth2Fa>("gen_otpauth", { otpauth: decodedText }).then((f: Auth2Fa) => {
                            if (f.success) {
                                notify(lm("qrSuccess"), "success", 5_000);
                                setOtpAuthPath(decodedText);
                            } else {
                                notify(lm("otpAuthKeyGenFailed"), "error", 5_000);
                            }
                        });
                    }
                })
                .catch(error => {
                    notify(lm("qrCodeImageReadFailed", undefined, { message: error }));
                });
        },
        [lm]
    );

    // The OK button was clicked.
    const onOkClick = React.useCallback(() => {
        setUserAccepted(true);
        onClose(true, otpAuthPath);
        setOtpAuthPath("");
    }, [onClose, otpAuthPath]);

    const onCancelClick = React.useCallback(() => {
        setUserAccepted(false);
        onClose(false);
        setOtpAuthPath("");
    }, [onClose]);

    return (
        <Popup //
            visible={visible}
            showCloseButton={true}
            dragEnabled={true}
            resizeEnabled={true}
            height={320}
            width={600}
            showTitle={true}
            title={lu("readQrCodeTitle")}
            onVisibleChange={onVisibleChange}
            onHiding={onHiding}
        >
            <div className={classNames(QrCodeInputPopupStyled.name, className)}>
                <div id="reader" />
                {visible && (
                    <DragDropFileStyled //
                        onFileChange={onFilesUpdated}
                        multiple={false}
                        dragDropFileHereText={lm("dragDropFilesHere")}
                        pasteFileText={lm("pasteFromClipboard")}
                        uploadFileText={lm("uploadFile")}
                    />
                )}
                <div className="Popup-ButtonRow">
                    <Button //
                        text={lu("ok")}
                        onClick={onOkClick}
                        disabled={otpAuthPath === ""}
                    />
                    <Button //
                        text={lu("cancel")}
                        onClick={onCancelClick}
                    />
                </div>
            </div>
        </Popup>
    );
};

const QrCodeInputPopupStyled = styled(QrCodeInputPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
    .Popup-entryEditor {
        height: 100%;
    }
    .Popup-ButtonRow {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: flex-end;
    }
    #reader {
        display: none;
    }
`;

export { QrCodeInputPopupStyled };
