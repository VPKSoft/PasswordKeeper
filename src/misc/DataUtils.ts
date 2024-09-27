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

import { DataEntry } from "../types/PasswordEntry";

const getNewId = (dataSource: DataEntry[]) => {
    let id = Math.max(...dataSource.map(f => f.id));
    if (id === Number.NEGATIVE_INFINITY) {
        id = 0;
    }
    id++;
    return id;
};

const newEntry = (parentId: number, dataSource: DataEntry[], newDataName: string) => {
    const id = getNewId(dataSource);

    const result: DataEntry = {
        name: newDataName,
        password: "",
        userName: "",
        notes: "",
        id: id,
        parentId: parentId,
        tags: dataSource.find(f => f.id === parentId)?.name,
    };

    return result;
};

const deleteEntryOrCategory = (dataSource: DataEntry[], entry: DataEntry) => {
    let newDataSource = [...dataSource];
    // The item being deleted is a category.
    if (entry.parentId === -1) {
        newDataSource = newDataSource.filter(f => f.parentId !== entry.id);
        const parentIndex = newDataSource.findIndex(f => f.id === entry.id);
        newDataSource.splice(parentIndex, 1);
    } else {
        const index = newDataSource.findIndex(f => f.id === entry.id);
        newDataSource.splice(index, 1);
    }

    return newDataSource;
};

const updateDataSource = (dataSource: DataEntry[], entry: DataEntry) => {
    const newDataSource = [...dataSource];
    const index = newDataSource.findIndex(f => f.id === entry.id);
    if (index === -1) {
        newDataSource.push(entry);
    } else {
        const firstTag = entry.tags?.split("|")?.[0];
        const parentByFirstTag = newDataSource.find(f => f.name === firstTag);

        if (parentByFirstTag) {
            entry.parentId = parentByFirstTag.id;
        } else {
            const parentId = getNewId(newDataSource);
            if (firstTag && firstTag.length > 0) {
                newDataSource.push({
                    parentId: -1,
                    name: firstTag,
                    id: parentId,
                });
            }
            entry.parentId = parentId;
        }

        newDataSource[index] = entry;
    }

    // Mark as un-categorized
    if (entry.tags?.trim() === "") {
        entry.parentId = generalId;
    }

    return newDataSource;
};

const testData: DataEntry[] = [
    {
        name: "General",
        id: 1,
        parentId: -1,
    },
    {
        name: "Sample 1",
        password: "password123",
        userName: "user1",
        notes: "2F2 required.",
        id: 2,
        parentId: 1,
    },
    {
        name: "Local Windows servers",
        id: 3,
        parentId: -1,
    },
    {
        name: "Server 1",
        userName: "admin",
        password: "assword",
        domain: "localhost",
        id: 4,
        parentId: 3,
    },
    {
        name: "Server 2",
        userName: "sysadmin",
        password: "secure1",
        domain: "localhost",
        id: 5,
        parentId: 3,
    },
];

const generalId = -1_000;

export { newEntry, updateDataSource, deleteEntryOrCategory, testData, generalId };
