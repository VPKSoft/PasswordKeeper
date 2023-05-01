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

type FileResult = {
    ok: boolean;
    fileName: string;
    fileData: DataEntry[];
    errorMessage?: string;
};

type BackendResult = {
    error: boolean;
    value: string;
};

const failed: FileResult = { ok: false, fileData: [], fileName: "" };

/**
 * Loads a file selected by user via open file dialog, decrypts the data and returns the decrypted data.
 * @param password The password used in the encryption.
 * @param extensionName The name of the file extension to display to the user via the open file dialog.
 * @param extension The file extension used in the open file dialog.
 * @returns A @see FileResult value with the loaded data or indicating failure.
 */
const loadFile = async (password: string, extensionName: string, extension = "pkd") => {
    const filePath = await open({
        filters: [
            {
                name: extensionName,
                extensions: [extension],
            },
        ],
    });

    if (filePath === null) {
        return failed;
    }

    let fileData: BackendResult = { error: false, value: "" };
    try {
        fileData = await invoke("load_file", { fileName: filePath, password: password });
        if (fileData.error) {
            return { ...failed, errorMessage: fileData.value };
        }
    } catch {
        return failed;
    }

    return {
        fileName: filePath,
        fileData: JSON.parse(fileData.value),
        ok: true,
    } as FileResult;
};

/**
 * Saves the specified data into an encrypted file using the specified password.
 * The file name is indicated by the user by specifying the file name in the displayed save file dialog.
 * @param fileData The data to save to file in encrypted form.
 * @param password The password used in the encryption.
 * @param extensionName The name of the file extension to display to the user via the save file dialog.
 * @param extension The file extension used in the save file dialog.
 * @returns A @see FileResult value with the the file name the data was saved into along with a success flag.
 */
const saveFile = async (fileData: DataEntry[], password: string, extensionName: string, extension = "pkd") => {
    const filePath = await save({
        filters: [
            {
                name: extensionName,
                extensions: [extension],
            },
        ],
    });

    const saveData = JSON.stringify(fileData);

    try {
        const saved: boolean = await invoke("save_file", { jsonData: saveData, fileName: filePath, password: password });
        return {
            fileName: filePath,
            fileData: [],
            ok: saved,
        } as FileResult;
    } catch {
        return failed;
    }
};

export { loadFile, saveFile };
