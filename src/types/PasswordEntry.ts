export type DataEntry = {
    name: string;
    domain?: string | undefined;
    address?: string | undefined;
    userName?: string | undefined;
    password?: string | undefined;
    notes?: string | undefined;
    id: number;
    parentId?: number;
};
