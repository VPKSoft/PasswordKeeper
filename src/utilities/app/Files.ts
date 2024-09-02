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

import { save, open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { DataEntry, FileData, FileOptions, GeneralEntry, isDataEntry, isGeneralEntry } from "../../types/PasswordEntry";

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
    /** The tags stored in the file. */
    tags: GeneralEntry<string>;
    /** An error message in case the file load or save operation was unsuccessful. */
    errorMessage?: string;
    /** Global file options. */
    dataOptions?: FileOptions;
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

const EmptyGeneralEntryString: GeneralEntry<string> = { type: "tags", values: [] };

/**
 * A value for a failed {@link FileResult}.
 */
const failed: FileResult = { ok: false, fileData: [], fileName: "", tags: EmptyGeneralEntryString };

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
    return filePath;
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

    return filePath;
};

/**
 * Loads the specified file, decrypts the data and returns the decrypted data.
 * @param password The password used in the encryption.
 * @param fileName The file name to decrypt the data from.
 * @returns A {@link FileResult} value with the loaded data or indicating failure.
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

    const items = JSON.parse(fileData.value) as (DataEntry | GeneralEntry<string>)[];

    // In the old file "format" everything was in same array with different types.
    if (Array.isArray(items)) {
        const itemsGeneral: GeneralEntry<string>[] = items.filter((f: DataEntry | GeneralEntry<string>) => isGeneralEntry(f)) as GeneralEntry<string>[];
        const itemTag = itemsGeneral.filter(f => f.type === "tags");

        return {
            fileName: fileName,
            fileData: items.filter((f: DataEntry | GeneralEntry<string>) => isDataEntry(f)),
            tags: itemTag.length > 0 ? itemTag[0] : EmptyGeneralEntryString,
            ok: true,
        } as FileResult;
    } else {
        // The new format.
        const data = items as FileData;

        const itemTag = (data.metaData ?? []).filter(f => f.type === "tags");
        return {
            fileName: fileName,
            fileData: data.entries,
            tags: itemTag.length > 0 ? itemTag[0] : EmptyGeneralEntryString,
            ok: true,
            dataOptions: data.dataOptions,
        } as FileResult;
    }
};

/**
 * Saves the specified data into the specified file encrypted using the specified password.
 * @param fileData The data to save to file in encrypted form.
 * @param password The password used in the encryption.
 * @returns A {@link FileResult} value with the the file name the data was saved into along with a success flag.
 */
const saveFile = async (fileData: FileData, password: string, fileName: string) => {
    const saveData = JSON.stringify(fileData);

    try {
        const saved: boolean = await invoke("save_file", { jsonData: saveData, fileName: fileName, password: password });
        return {
            fileName: fileName,
            fileData: [],
            tags: EmptyGeneralEntryString,
            ok: saved,
        } as FileResult;
    } catch {
        return failed;
    }
};

/**
 * Generates a distinct sorted array of tags for a specified data source.
 * @param fileData The file data contents.
 * @returns Thr distinct sorted array of the tags in the data.
 */
const generateTags = <T>(fileData: (DataEntry | GeneralEntry<T>)[]) => {
    let tagArray: string[] = [];
    const data: DataEntry[] = fileData.filter(f => isDataEntry(f)) as DataEntry[];
    for (const item of data) {
        if (item.tags) {
            tagArray.push(...item.tags.split("|"));
        }
    }

    tagArray = tagArray.sort((a, b) => {
        if (a < b) {
            return -1;
        }

        if (a > b) {
            return 1;
        }

        return 0;
    });

    // eslint-disable-next-line unicorn/no-useless-spread
    const resultSet = new Set<string>([...tagArray]);

    return [...resultSet];
};

export { loadFile, saveFile, selectFileToOpen, selectFileToSave, generateTags };
