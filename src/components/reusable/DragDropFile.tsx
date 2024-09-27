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
import { styled } from "styled-components";
import classNames from "classnames";
import { CommonProps } from "../Types";
import { DragDropEvent, DragDropState, useTauriDragAndDrop } from "../../hooks/useTauriDragAndDrop";
import { loadImageFile } from "../../utilities/app/TauriBackend";

/**
 * The props for the {@link DragDropFile} component.
 */
type DragDropFileProps = {
    /** Occurs after a file has been selected, dropped into the container or pasted from the clipboard. */
    onFileChange: (files: File | File[]) => void;
    /** A value indicating whether multiple file selection is allowed. */
    multiple?: boolean;
    /** The text for the "Drag and drop your file here or" for localization. The mentioned text is the default value. */
    dragDropFileHereText?: string;
    /** The text for the "Paste file data from clipboard or" for localization. The mentioned text is the default value. */
    pasteFileText?: string;
    /** The text for the "Upload a file" for localization. The mentioned text is the default value. */
    uploadFileText?: string;
} & CommonProps;

// Based on the code at Codemzy, see: https://www.codemzy.com/blog/react-drag-drop-file-upload 🙏

/**
 * A component to accept files via drag and drop, paste via clipboard or by selecting a file manually.
 * @param param0 The component props: {@link DragDropFileProps}.
 * @returns A component.
 * @copyright The component: https://www.codemzy.com/blog/react-drag-drop-file-upload
 * @copyright The paste option, (MIT license): https://github.com/phuocng/html-dom / https://github.com/phuocng/html-dom/blob/master/contents/paste-an-image-from-the-clipboard.md
 */
const DragDropFile = ({
    className, //
    onFileChange,
    multiple = false,
    dragDropFileHereText = "Drag and drop your file here or",
    pasteFileText = "Paste file data from clipboard or",
    uploadFileText = "Upload a file",
}: DragDropFileProps) => {
    const inputRef = React.createRef<HTMLInputElement>();

    const onDropFile = React.useCallback<DragDropEvent>(
        (state: DragDropState, files?: string[] | undefined) => {
            if (state === DragDropState.Drop && files && files[0]) {
                const uploadFiles = multiple ? files : files[0];
                if (typeof uploadFiles === "string") {
                    void createFileFromName(uploadFiles).then(file => onFileChange(file));
                } else if (Array.isArray(uploadFiles)) {
                    void createFilesFromNames(uploadFiles).then(files => onFileChange(files));
                }
            }
        },
        [multiple, onFileChange]
    );

    useTauriDragAndDrop(true, true, "form-file-upload", 5, onDropFile);

    // Triggers when file is selected with click.
    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            if (e.target.files && e.target.files[0]) {
                const uploadFiles = multiple ? createFileArray(e.target.files) : e.target.files[0];
                onFileChange(uploadFiles);
            }
        },
        [multiple, onFileChange]
    );

    // Triggers the input when the button is clicked.
    const onButtonClick = React.useCallback(() => {
        inputRef.current?.click();
    }, [inputRef]);

    // An image is pasted via the clipboard into the document.
    const onPasteImage = React.useCallback(
        (e: ClipboardEvent) => {
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
                onFileChange(blob);
            }
        },
        [onFileChange]
    );

    // Add and cleanup the event listener for image pasting.
    React.useEffect(() => {
        document.addEventListener("paste", onPasteImage);

        return () => {
            document.removeEventListener("paste", onPasteImage);
        };
    }, [onPasteImage]);

    // Submit callback for the form.
    const onSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }, []);

    return (
        <form //
            id="form-file-upload"
            onSubmit={onSubmit}
            className={classNames(DragDropFileStyled.name, className)}
        >
            <input //
                ref={inputRef}
                type="file"
                accept="image/*"
                id="input-file-upload"
                multiple={multiple}
                onChange={handleChange}
            />
            <label //
                id="label-file-upload"
                htmlFor="input-file-upload"
                className="drag-active"
            >
                <div>
                    <p>{dragDropFileHereText}</p>
                    <p>{pasteFileText}</p>
                    <button className="upload-button" onClick={onButtonClick}>
                        {uploadFileText}
                    </button>
                </div>
            </label>
        </form>
    );
};

const createFileArray = (files: FileList) => {
    const result: File[] = [];
    for (const file of files) {
        result.push(file);
    }

    return result;
};

const createFileFromName = async (fileName: string) => {
    const data = await loadImageFile(fileName);
    return new File([new Uint8Array(data).buffer], fileName, {
        type: "image/png",
    });
};

const createFilesFromNames = async (fileNames: string[]) => {
    const files = await Promise.all(fileNames.map(fileName => createFileFromName(fileName)));
    return files;
};

const DragDropFileStyled = styled(DragDropFile)`
    height: 100%;
    #form-file-upload {
        height: 16rem;
        width: 28rem;
        max-width: 100%;
        text-align: center;
        position: relative;
    }

    #input-file-upload {
        display: none;
    }

    #label-file-upload {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-width: 2px;
        border-radius: 1rem;
        border-style: dashed;
        border-color: #cbd5e1;
        background-color: #f8fafc;
    }

    #label-file-upload.drag-active {
        background-color: #ffffff;
    }

    .upload-button {
        cursor: pointer;
        padding: 0.25rem;
        font-size: 1rem;
        border: none;
        font-family: "Oswald", sans-serif;
        background-color: transparent;
    }

    .upload-button:hover {
        text-decoration-line: underline;
    }

    #drag-file-element {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 1rem;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
    }
`;

export { DragDropFileStyled };
