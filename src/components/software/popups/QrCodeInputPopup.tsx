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
import styled from "styled-components";
import classNames from "classnames";
import { Popup } from "devextreme-react";
import { Html5Qrcode } from "html5-qrcode/esm/html5-qrcode";
import { invoke } from "@tauri-apps/api/tauri";
import { CommonProps } from "../../Types";
import { DragDropFileStyled } from "../../reusable/DragDropFile";

/**
 * The props for the {@link QrCodeInputPopup} component.
 */
type QrCodeInputPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
} & CommonProps;

/**
 * A popup component for querying the a QR code image from the user.
 * @param param0 The component props: {@link QrCodeInputPopupProps}.
 * @returns A component.
 */
const QrCodeInputPopup = ({
    className, //
    visible,
}: QrCodeInputPopupProps) => {
    const [shown, setShown] = React.useState(false);

    const onShown = React.useCallback(() => {
        setShown(true);
    }, []);

    const onVisibleChange = React.useCallback((visible: boolean) => {
        if (!visible) {
            setShown(false);
        }
    }, []);

    const onHiding = React.useCallback(() => {
        setShown(false);
    }, []);

    const onFilesUpdated = React.useCallback((e: File | File[]) => {
        const scanner = new Html5Qrcode("reader");
        const file = Array.isArray(e) ? e[0] : e;

        void scanner.scanFile(file, false).then((decodedText: string) => {
            console.log(decodedText);
            void invoke("gen_otpauth", { otpauth: decodedText }).then((f: any) => console.log(f));
        });

        console.log(e);
    }, []);

    return (
        <Popup //
            visible={visible}
            showCloseButton={true}
            dragEnabled={true}
            resizeEnabled={true}
            height={320}
            width={600}
            showTitle={true}
            onShown={onShown}
            onVisibleChange={onVisibleChange}
            onHiding={onHiding}
            className={classNames(QrCodeInputPopupStyled.name, className)}
        >
            <div id="reader" />
            <DragDropFileStyled //
                onFileChange={onFilesUpdated}
                multiple={false}
            />
        </Popup>
    );
};

const QrCodeInputPopupStyled = styled(QrCodeInputPopup)`
    #reader {
        display: none;
    }
`;

export { QrCodeInputPopupStyled };
