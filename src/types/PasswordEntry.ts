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

/**
 * The file data, entries, metadata and file global options.
 */
type FileData = {
    /** The password entries and categories. */
    entries: DataEntry[];
    /** The metadata information, e.g. The tags used for the entries in the file. */
    metaData?: GeneralEntry<string>[];
    /** Global file options. */
    dataOptions?: FileOptions;
};

/**
 * CSS font properties.
 */
type CssFont = {
    /** The `font-size` CSS property value. */
    fontSize?: string;
    /** The `font-family` CSS property value. */
    fontFamily?: string;
    /** The `font-weight` CSS property value. */
    fontWeight?: string;
    /** The `font-style` CSS property value. */
    FontStyle: "normal" | "italic" | "oblique" | "initial" | "inherit";
};

/**
 * Creates a CSS style declaration of the specified {@link CssFont}.
 * @param font The {@link CssFont} specifying the font style data.
 * @returns The CSS styling for the font.
 */
const makeFont = (font?: CssFont) => {
    let result = "";

    if (!font) {
        return result;
    }

    if (font.fontSize) {
        result += `font-size: ${font.fontSize};\n`;
    }

    if (font.fontFamily) {
        result += `font-family: ${font.fontFamily};\n`;
    }

    if (font.fontWeight) {
        result += `font-weight: ${font.fontWeight};\n`;
    }

    if (font.FontStyle) {
        result += `font-style: ${font.FontStyle};\n`;
    }

    return result;
};

/**
 * The entry / category data format for the program.
 */
type DataEntry = {
    /** The name of the entry or a category. */
    name: string;
    /** The optional domain for the login credentials. */
    domain?: string | undefined;
    /** The host address where the login information is to be used. */
    address?: string | undefined;
    /** The user name for the credentials. */
    userName?: string | undefined;
    /** The password for the login credentials. */
    password?: string | undefined;
    /** Additional notes for the login information. */
    notes?: string | undefined;
    /** An unique identifier for an entry or a category. */
    id: number;
    /** In case of an entry the parent category for the entry. Otherwise -1. */
    parentId: number;
    /** The key <--> URL for OTP authentication. */
    otpAuthKey?: string;
    /** The tags assigned for the item. These are separated with the `|` character. */
    tags?: string;
    /** A value indicating whether to use markdown for the {@link DataEntry.notes} rendering. */
    useMarkdown?: boolean;
};

/**
 * An additional generic metadata to save along the password items.
 */
type GeneralEntry<T> = {
    /** The type of the metadata. */
    type: "tags";
    /** The values in the metadata. */
    values: Array<T>;
};

type FileOptions = {
    useMarkdownOnNotes: boolean;
    notesFont?: CssFont;
};

/**
 * A type guard for the {@link DataEntry} type.
 * @param value Either {@link DataEntry} or {@link GeneralEntry} type to check if the parameter is of type of {@link DataEntry}.
 * @returns `true` if the specified parameter type was {@link DataEntry}; otherwise false.
 */
const isDataEntry = (value: DataEntry | GeneralEntry<unknown>): value is DataEntry => {
    return (value as DataEntry).id !== undefined;
};

/**
 * A type guard for the {@link GeneralEntry} type.
 * @param value Either {@link DataEntry} or {@link GeneralEntry} type to check if the parameter is of type of {@link GeneralEntry}.
 * @returns `true` if the specified parameter type was {@link GeneralEntry}; otherwise false.
 */
const isGeneralEntry = <T>(value: DataEntry | GeneralEntry<T>): value is GeneralEntry<T> => {
    return (value as GeneralEntry<T>).type !== undefined;
};

export { isDataEntry, isGeneralEntry, makeFont };
export type { DataEntry, GeneralEntry, FileData, FileOptions, CssFont };
