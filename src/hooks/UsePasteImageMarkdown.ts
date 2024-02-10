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

/**
 * A custom hook to allow paste images as Markdown syntax to a {@link HTMLTextAreaElement} at cursor position.
 * @param {HTMLTextAreaElement | null} element The {@link HTMLTextAreaElement} to allow the Markdown syntax image paste into.
 * @param {boolean} enabled A value indicating whether the paste is enabled. **Only one** can be enabled with this hook as the `paste` event listener is attached to the {@link Document}.
 */
const usePasteImageMarkdown = (element: HTMLTextAreaElement | null, enabled: boolean) => {
    // An image is pasted via the clipboard into the document.
    const onPasteImage = React.useCallback(
        (e: ClipboardEvent) => {
            if (!element) {
                return;
            }

            const clipboardItems = e.clipboardData?.items;
            const items: DataTransferItem[] = Array.prototype.slice.call(clipboardItems).filter((item: DataTransferItem) => {
                // Filter the image items only
                return item.type.includes("image");
            });

            if (items.length === 0) {
                return;
            }
            const item = items[0];
            // Get the blob of image == File.
            const blob = item.getAsFile();
            if (blob) {
                const fileReader = new FileReader();

                // Set the Markdown image from the base64 data.
                fileReader.onloadend = () => {
                    element.setRangeText(`![](${fileReader.result})`);
                };

                fileReader.readAsDataURL(blob);
            }
        },
        [element]
    );

    // Add and cleanup the event listener for image pasting.
    React.useEffect(() => {
        if (enabled) {
            document.addEventListener("paste", onPasteImage);

            return () => {
                document.removeEventListener("paste", onPasteImage);
            };
        }
    }, [enabled, onPasteImage]);
};

export { usePasteImageMarkdown };
