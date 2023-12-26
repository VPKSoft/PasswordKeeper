import * as React from "react";
import { styled } from "styled-components";
import classNames from "classnames";
import { Popup } from "devextreme-react";
import QRCode from "qrcode";
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
    const [shown, setShown] = React.useState(false);
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
    }, [qrCodeError, qrUrl, visible, shown, qrSize]);

    // Handle the onVisibleChange callback of the Popup component.
    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onClose();
                setShown(false);
            }
        },
        [onClose]
    );

    // Handle the onHiding callback of the Popup component.
    const onHiding = React.useCallback(() => {
        onClose();
        setShown(false);
    }, [onClose]);

    // Set this shown flag to allow the querySelector to find the canvas element via an effect.
    const popupShown = React.useCallback(() => {
        setShown(true);
    }, []);

    const width = React.useMemo(() => (qrSize ?? 180) + 60, [qrSize]);
    const height = React.useMemo(() => (qrSize ?? 180) + 120, [qrSize]);

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
        <Popup //
            height={height}
            title={lu("qrCodePopupTitle")}
            visible={visible}
            onHiding={onHiding}
            onVisibleChange={onVisibleChange}
            onShown={popupShown}
            width={width}
        >
            {contextHolder}
            <div className={classNames(DisplayQrCodePopup.name, className)}>
                <canvas //
                    id="canvas"
                    onClick={copyToClipboard}
                />
            </div>
        </Popup>
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
