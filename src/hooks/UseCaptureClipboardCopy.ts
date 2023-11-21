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

/**
 * An enumeration for the clipboard event type for the {@link useCaptureClipboardCopy} hook callback.
 */
enum ClipboardEventSource {
    /** The clipboard event originated from context menu. */
    ContextMenu,
    /** The clipboard event originated from keyboard. E.g. Ctrl+C or ⌘-C key combination. */
    Keyboard,
    /** The clipboard event source is unknown. */
    Other,
}

/**
 * The type of the callback function for the {@link useCaptureClipboardCopy} hook.
 */
type OnClipboardCopy = (source: ClipboardEventSource) => void;

/**
 * A custom hook for capturing and reporting clipboard copy events for the current {@link document}.
 * @param onClipboardCopy A callback which is raised when the clipboard event occurs.
 * @returns The current clipboard text value and a callback to reset the clipboard value.
 */
const useCaptureClipboardCopy = (onClipboardCopy?: OnClipboardCopy): [string, () => void] => {
    const [clipboardValue, setClipboardValue] = React.useState<string>("");

    const resetClipboardValue = React.useCallback(() => {
        return navigator.clipboard
            .readText()
            .then(setClipboardValue)
            .catch(() => setClipboardValue(""));
    }, []);

    const contextMenu = React.useRef<boolean>(false);
    const fromKeyboard = React.useRef<boolean>(false);
    const clipboardCopyEvent = React.useCallback(() => {
        void navigator.clipboard.readText().then(value => {
            setClipboardValue(value);
            if (contextMenu.current) {
                onClipboardCopy?.(ClipboardEventSource.ContextMenu);
            } else if (fromKeyboard.current) {
                onClipboardCopy?.(ClipboardEventSource.Keyboard);
            } else {
                onClipboardCopy?.(ClipboardEventSource.Other);
            }
            contextMenu.current = false;
            fromKeyboard.current = false;
        });
    }, [onClipboardCopy]);

    const keyboardEvent = React.useCallback((e: KeyboardEvent) => {
        if ((e.ctrlKey === true || e.metaKey === true) && (e.key === "c" || e.key === "C")) {
            fromKeyboard.current = true;
        }
    }, []);

    const contextMenuEvent = React.useCallback(() => {
        contextMenu.current = true;
    }, []);

    const clipboardNotifyOther = React.useCallback(() => {
        contextMenu.current = false;
        fromKeyboard.current = false;
        clipboardCopyEvent();
    }, [clipboardCopyEvent]);

    React.useEffect(() => {
        contextMenu.current = false;
        fromKeyboard.current = false;
        document.addEventListener("copy", clipboardCopyEvent);
        document.addEventListener("keydown", keyboardEvent);
        document.addEventListener("contextmenu", contextMenuEvent);
        document.addEventListener("clipboardOther", clipboardNotifyOther);

        return () => {
            contextMenu.current = false;
            fromKeyboard.current = false;
            document.removeEventListener("copy", clipboardCopyEvent);
            document.removeEventListener("keydown", keyboardEvent);
            document.removeEventListener("contextmenu", contextMenuEvent);
            document.removeEventListener("clipboardOther", clipboardNotifyOther);
        };
    }, [clipboardCopyEvent, clipboardNotifyOther, contextMenuEvent, keyboardEvent]);

    return [clipboardValue, resetClipboardValue];
};

/**
 * Dispatches an event to which the {@link useCaptureClipboardCopy} hook will react with {@link ClipboardEventSource.Other} value as callback.
 */
const clipboardNotifyOther = () => {
    document.dispatchEvent(new CustomEvent("clipboardOther"));
};

export { useCaptureClipboardCopy, clipboardNotifyOther };
export { ClipboardEventSource };
export type { OnClipboardCopy };
