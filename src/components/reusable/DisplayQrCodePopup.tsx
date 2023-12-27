import * as React from "react";
import { styled } from "styled-components";
import classNames from "classnames";
import QRCode from "qrcode";
import { Modal } from "antd";
import { CommonProps } from "../Types";
import { useLocalize } from "../../i18n";
import { clipboardNotifyOther } from "../../hooks/UseCaptureClipboardCopy";
import { useNotify } from "./Notify";

/**
 * The props for the {@link DisplayQrCodePopup} component.
 */
type DisplayQrCodePopupProps = {
    /** The OTPAuth URL. */
    qrUrl: string | undefined;
    /** The size of the QR code in pixels to display. */
    qrSize?: number;
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** Occurs when the popup is closed. */
    onClose: () => void;
} & CommonProps;

/**
 * A popup to display QR code for OTPAuth URL.
 * @param param0 The component props: {@link DisplayQrCodePopupProps}.
 * @returns A component.
 */
const DisplayQrCodePopup = ({
    className, //
    qrUrl,
    qrSize = 180,
    visible,
    onClose,
}: DisplayQrCodePopupProps) => {
    const lu = useLocalize("ui");
    const [contextHolder, notification] = useNotify();

    // A callback to display a toast for a possible error with QR code generation.
    const qrCodeError = React.useCallback(
        (error: Error | null | undefined) => {
            // The callback is also called with null value so disregard that.
            if ((error ?? undefined) === undefined) {
                return;
            }

            notification("error", error, 5_000);
        },
        [notification]
    );

    // Draw the QR code to the canvas element.
    React.useEffect(() => {
        if (qrUrl) {
            const canvas = document.querySelector("#canvas");
            if (canvas) {
                QRCode.toCanvas(canvas, qrUrl, { width: qrSize ?? 180 }, qrCodeError);
            }
        }
    }, [qrCodeError, qrUrl, visible, qrSize]);

    const width = React.useMemo(() => (qrSize ?? 180) + 60, [qrSize]);

    // Copy the QR code value into the clipboard.
    const copyToClipboard = React.useCallback(() => {
        const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
        if (canvas) {
            canvas.toBlob(pngBlob => {
                if (pngBlob) {
                    navigator.clipboard
                        .write([new ClipboardItem({ "image/png": pngBlob })])
                        .then(() => {
                            notification("success", lu("clipboardCopySuccess"), 5_000);
                            clipboardNotifyOther();
                        })
                        .catch(() => {
                            notification("error", lu("clipboardCopyFailed"), 5_000);
                        });
                } else {
                    notification("error", lu("clipboardCopyFailed"), 5_000);
                }
            });
        }
    }, [lu, notification]);

    return (
        <Modal //
            title={lu("qrCodePopupTitle")}
            open={visible}
            width={width}
            centered
            onCancel={onClose}
            footer={null}
        >
            {contextHolder}
            <div className={classNames(DisplayQrCodePopup.name, className)}>
                <canvas //
                    id="canvas"
                    onClick={copyToClipboard}
                />
            </div>
        </Modal>
    );
};

const DisplayQrCodePopupStyled = styled(DisplayQrCodePopup)`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
`;

export { DisplayQrCodePopupStyled };
