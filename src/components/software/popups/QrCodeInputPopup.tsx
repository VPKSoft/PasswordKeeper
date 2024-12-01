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

import { invoke } from "@tauri-apps/api/core";
import { Button, Modal } from "antd";
import classNames from "classnames";
import { decodeMigrationUriData, makeOtpAuthKey } from "gauth-decode";
import { Html5Qrcode } from "html5-qrcode/esm/html5-qrcode";
import * as React from "react";
import { styled } from "styled-components";
import { useLocalize } from "../../../I18n";
import { useAntdTheme } from "../../../context/AntdThemeContext";
import type { Auth2Fa, CommonProps } from "../../Types";
import { DragDropFileStyled } from "../../reusable/DragDropFile";
import { useNotify } from "../../reusable/Notify";

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
    const [otpAuthPath, setOtpAuthPath] = React.useState("");
    const [contextHolder, notification] = useNotify();
    const { antdTheme } = useAntdTheme();

    const lm = useLocalize("messages");
    const lu = useLocalize("ui");

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
                                            notification("warning", lm("qrMoreThan1"), 5);
                                        }
                                        notification("success", lm("qrSuccess"), 5);
                                    } else {
                                        notification("error", lm("otpAuthKeyGenFailed"), 5);
                                    }
                                });
                            } else {
                                notification("error", lm("otpAuthKeyGenFailed"), 5);
                            }
                        } catch {
                            notification("error", lm("otpAuthKeyGenFailed"), 5);
                        }
                    } else {
                        void invoke<Auth2Fa>("gen_otpauth", { otpauth: decodedText }).then((f: Auth2Fa) => {
                            if (f.success) {
                                notification("success", lm("qrSuccess"), 5);
                                setOtpAuthPath(decodedText);
                            } else {
                                notification("error", lm("otpAuthKeyGenFailed"), 5);
                            }
                        });
                    }
                })
                .catch(error => {
                    notification("error", lm("qrCodeImageReadFailed", undefined, { message: error }), 5);
                });
        },
        [lm, notification]
    );

    // The OK button was clicked.
    const onOkClick = React.useCallback(() => {
        onClose(true, otpAuthPath);
        setOtpAuthPath("");
    }, [onClose, otpAuthPath]);

    const onCancelClick = React.useCallback(() => {
        onClose(false);
        setOtpAuthPath("");
    }, [onClose]);

    return (
        <Modal //
            open={visible}
            width={600}
            title={lu("readQrCodeTitle")}
            centered
            onCancel={onCancelClick}
            footer={null}
        >
            <div className={classNames(QrCodeInputPopupStyled.name, className)}>
                <div id="reader" />
                {contextHolder}
                {visible && (
                    <DragDropFileStyled //
                        onFileChange={onFilesUpdated}
                        multiple={false}
                        dragDropFileHereText={lm("dragDropFilesHere")}
                        pasteFileText={lm("pasteFromClipboard")}
                        uploadFileText={lm("uploadFile")}
                        darkMode={antdTheme === "dark"}
                    />
                )}
                <div className="Popup-ButtonRow">
                    <Button //
                        onClick={onOkClick}
                        disabled={otpAuthPath === ""}
                    >
                        {lu("ok")}
                    </Button>
                    <Button //
                        onClick={onCancelClick}
                    >
                        {lu("cancel")}
                    </Button>
                </div>
            </div>
        </Modal>
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
