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

import * as React from "react";
import classNames from "classnames";
import { styled } from "styled-components";
import { Button, Modal } from "antd";
import { DialogButtons, DialogResult, PopupType } from "../../../types/Enums";
import { useLocalize } from "../../../i18n";
import { CommonProps } from "../../Types";
import { darkModeMenuBackground, lightModeMenuBackground } from "../../app/antd-constants";

/**
 * The props for the {@link ConfirmPopup} component.
 */
type ConfirmPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** The mode of the popup. */
    mode: PopupType;
    /** The message to display on the popup contents. */
    message: string;
    /** The buttons to display on the popup. */
    buttons: DialogButtons;
    /** An optional title to override the default, which is generated from the {@link mode} prop value. */
    overrideTitle?: string;
    /** A value indicating whether to use dark mode with the application. */
    darkMode: boolean;
    /** Occurs when the popup is closed. The result is passed as a parameter to the callback. */
    onClose: (result: DialogResult) => void;
} & CommonProps;

/**
 * A popup component to display different styled layouts depending on the {@link mode} and the {@link buttons} props.
 * @param param0 The component props: {@link ConfirmPopupProps}.
 * @returns A component.
 */
const ConfirmPopup = ({
    className, //
    visible,
    mode,
    message,
    buttons,
    overrideTitle,
    onClose,
}: ConfirmPopupProps) => {
    const lc = useLocalize("common");
    const hideViaButton = React.useRef(false);

    // Memoize the popup title depending on the specified mode.
    const title = React.useMemo(() => {
        if (overrideTitle) {
            return overrideTitle;
        }

        switch (mode) {
            case PopupType.Confirm: {
                return lc("confirm");
            }
            case PopupType.Information: {
                return lc("information");
            }
            case PopupType.Warning: {
                return lc("warning");
            }
            default: {
                return lc("information");
            }
        }
    }, [lc, mode, overrideTitle]);

    // Close the dialog with the specified result.
    const onCloseCallback = React.useCallback(
        (result: DialogResult) => {
            // Set the ref to indicate that the
            // dialog was closed via a button to avoid double-callback
            // from the hiding event.
            hideViaButton.current = true;

            // Call the actual close callback.
            onClose(result);
        },
        [onClose]
    );

    // The Yes button was clicked.
    const onYesClick = React.useCallback(() => {
        onCloseCallback(DialogResult.Yes);
    }, [onCloseCallback]);

    // The No button was clicked.
    const onNoClick = React.useCallback(() => {
        onCloseCallback(DialogResult.No);
    }, [onCloseCallback]);

    // The Cancel button was clicked.
    const onCancelClick = React.useCallback(() => {
        onCloseCallback(DialogResult.Cancel);
    }, [onCloseCallback]);

    return (
        <Modal //
            title={title}
            open={visible}
            width={400}
            footer={null}
            onCancel={onCancelClick}
            centered
        >
            <div className={classNames(ConfirmPopup.name, className)}>
                <div className="Popup-messageText">{message}</div>
                <div className="Popup-ButtonRow">
                    {(buttons & DialogButtons.Yes) === DialogButtons.Yes && (
                        <Button //
                            onClick={onYesClick}
                        >
                            {lc("yes")}
                        </Button>
                    )}
                    {(buttons & DialogButtons.No) === DialogButtons.No && (
                        <Button //
                            onClick={onNoClick}
                        >
                            {lc("no")}
                        </Button>
                    )}
                    {(buttons & DialogButtons.Cancel) === DialogButtons.Cancel && (
                        <Button //
                            onClick={onCancelClick}
                        >
                            {lc("cancel")}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

const StyledConfirmPopup = styled(ConfirmPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: ${props => (props.darkMode ? darkModeMenuBackground : lightModeMenuBackground)};
    .Popup-messageText {
        height: 100%;
    }
    .Popup-ButtonRow {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: flex-end;
        gap: 10px;
    }
`;

export { StyledConfirmPopup };
