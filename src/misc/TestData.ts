import { DataEntry } from "../types/PasswordEntry";

const newEntry = (parentId: number, dataSource: DataEntry[], newDataName: string) => {
    let id = Math.max(...dataSource.map(f => f.id));
    id++;

    const result: DataEntry = {
        name: newDataName,
        password: "",
        userName: "",
        notes: "",
        id: id,
        parentId: parentId,
    };

    return result;
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

export { newEntry, testData };
