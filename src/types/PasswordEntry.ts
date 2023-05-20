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
 * The entry / category data format for the program.
 */
export type DataEntry = {
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
};
