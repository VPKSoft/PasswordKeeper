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

import { save, open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { DataEntry } from "../../types/PasswordEntry";

/**
 * A result type for the {@link loadFile} and {@link saveFile} functions.
 */
type FileResult = {
    /** A value indicating whether the file was saved or opened successfully. */
    ok: boolean;
    /** The name of file. */
    fileName: string;
    /** The file data containing all the categories and items saved into the file. */
    fileData: DataEntry[];
    /** An error message in case the file load or save operation was unsuccessful. */
    errorMessage?: string;
};

/**
 * The result type the Rust "backend" gives upon *load_file* invocation.
 */
type BackendResult = {
    /** A value indicating whether an error occurred. */
    error: boolean;
    /** A JSON string data of the file contents. */
    value: string;
};

/**
 * A value for a failed {@link FileResult}.
 */
const failed: FileResult = { ok: false, fileData: [], fileName: "" };

/**
 * Displays an open file dialog and returns the user selected file.
 * @param extensionName The name of the file extension to display to the user via the open file dialog.
 * @param extension The file extension used in the open file dialog.
 * @returns The user selected file name as string or null if the dialog was canceled.
 */
const selectFileToOpen = async (extensionName: string, extension = "pkd") => {
    const filePath = await open({
        filters: [
            {
                name: extensionName,
                extensions: [extension],
            },
        ],
    });

    return filePath as string | null;
};

/**
 * Displays a save file dialog and returns the file name.
 * @param extensionName The name of the file extension to display to the user via the open file dialog.
 * @param extension The file extension used in the open file dialog.
 * @returns The user specified file name as string or null if the dialog was canceled.
 */
const selectFileToSave = async (extensionName: string, extension = "pkd") => {
    let filePath = await save({
        filters: [
            {
                name: extensionName,
                extensions: [extension],
            },
        ],
    });

    // Add the extension to the file name in case the save file dialog didn't add it
    // automatically.
    if (filePath && extension.trim() !== "" && !filePath.endsWith(extension)) {
        filePath = filePath + `.${extension}`;
    }

    return filePath as string | null;
};

/**
 * Loads the specified file, decrypts the data and returns the decrypted data.
 * @param password The password used in the encryption.
 * @param fileName The file name to decrypt the data from.
 * @returns A @see FileResult value with the loaded data or indicating failure.
 */
const loadFile = async (password: string, fileName: string) => {
    let fileData: BackendResult = { error: false, value: "" };
    try {
        fileData = await invoke("load_file", { fileName: fileName, password: password });
        if (fileData.error) {
            return { ...failed, errorMessage: fileData.value };
        }
    } catch {
        return failed;
    }

    return {
        fileName: fileName,
        fileData: JSON.parse(fileData.value),
        ok: true,
    } as FileResult;
};

/**
 * Saves the specified data into the specified file encrypted using the specified password.
 * @param fileData The data to save to file in encrypted form.
 * @param password The password used in the encryption.
 * @returns A @see FileResult value with the the file name the data was saved into along with a success flag.
 */
const saveFile = async (fileData: DataEntry[], password: string, fileName: string) => {
    const saveData = JSON.stringify(fileData);

    try {
        const saved: boolean = await invoke("save_file", { jsonData: saveData, fileName: fileName, password: password });
        return {
            fileName: fileName,
            fileData: [],
            ok: saved,
        } as FileResult;
    } catch {
        return failed;
    }
};

export { loadFile, saveFile, selectFileToOpen, selectFileToSave };
