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

import classNames from "classnames";
import { ScrollPanel } from "primereact/scrollpanel";
import { Tree, TreeDragDropEvent, TreeExpandedEvent, TreeExpandedKeysType, TreeSelectionEvent } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import * as React from "react";
import { styled } from "styled-components";
import { DataEntry, SearchKeys } from "../../types/PasswordEntry";
import { CommonProps } from "../Types";

/**
 * The props for the {@link PasswordList} component.
 */
type PasswordListProps = {
    /** The data source for the component. */
    dataSource: DataEntry[];
    /** A search value for filtering the password list. */
    searchValue: string;
    /** The expanded keys of the {@link Tree}. */
    expandedKeys: TreeExpandedKeysType | undefined;
    /** Occurs when the selected item has been changed. */
    setEntry: (value: DataEntry | null) => void;
    /** A callback to pass the changed data source to the parent component. */
    setDataSource: (dataSource: DataEntry[]) => void;
    /** Sets the expanded keys of the {@link Tree}. */
    setExpandedKeys: (value: TreeExpandedKeysType | undefined) => void;
} & CommonProps;

/**
 * A component to list the password entries and categories in a tree
 * with drag & drop support for ordering and organizing items.
 * @param param0 The component props: {@link PasswordListProps}.
 * @returns A component.
 */
const PasswordList = ({
    className, //
    dataSource,
    searchValue,
    expandedKeys,
    setEntry,
    setDataSource,
    setExpandedKeys,
}: PasswordListProps) => {
    const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
    const treeRef = React.useRef<Tree>(null);

    // Memoize a node structure of the data source.
    const nodes = React.useMemo(() => {
        const parents = dataSource.filter(f => f.parentId === -1);
        const children = dataSource.filter(f => f.parentId !== -1);
        const result = parents.map(f => createNode(f, children));
        return result;
    }, [dataSource]);

    // Set the selected item on selection change.
    const onSelectionChange = React.useCallback(
        (event: TreeSelectionEvent) => {
            setSelectedItem(event.value as string | null);
            const found = dataSource.find(f => f.id.toString() === event.value?.toString()) ?? null;
            setEntry(found);
        },
        [dataSource, setEntry]
    );

    // Filter the tree list when the search text changes.
    React.useEffect(() => {
        treeRef?.current?.filter(searchValue);
    }, [searchValue, treeRef]);

    // Handle the expanded keys change.
    const onToggle = React.useCallback(
        (e: TreeExpandedEvent) => {
            setExpandedKeys(e.value);
        },
        [setExpandedKeys]
    );

    // Handle the drag & drop operation of the password list.
    const onDragDrop = React.useCallback(
        (e: TreeDragDropEvent) => {
            const result = dragDropDataSource(e.dropNode.data, e.dragNode.data, dataSource);
            if (Array.isArray(result)) {
                setDataSource(result);
            }
        },
        [dataSource, setDataSource]
    );

    return (
        <ScrollPanel className={classNames(PasswordList.name, className)}>
            <Tree //
                ref={treeRef}
                className="PasswordList-tree"
                value={nodes}
                selectionMode="single"
                selectionKeys={selectedItem}
                onSelectionChange={onSelectionChange}
                filterBy={filterBy}
                filterMode="strict"
                filter={true}
                expandedKeys={expandedKeys}
                onToggle={onToggle}
                onDragDrop={onDragDrop}
                dragdropScope="passwordList"
            ></Tree>
        </ScrollPanel>
    );
};

/** The definition for filtering the password list {@link Tree} */
const filterBy = SearchKeys.map(f => "data." + f).join(",");

/**
 * Creates a {@link TreeNode} from the specified entry and data source.
 * @param value The value to create a {@link TreeNode} from.
 * @param values The data source to use for possible node children.
 * @returns A {@link TreeNode} created from the specified {@link DataEntry}.
 */
const createNode = (value: DataEntry, values: DataEntry[]) => {
    const result: TreeNode = {
        label: value.name,
        id: value.id.toString(),
        key: value.id,
        icon: isGroup(value) ? "fa-regular fa-folder-open" : "fa-solid fa-tag",
        children: isGroup(value) ? values.filter(f => f.parentId === value.id).map(f => createNode(f, values)) : undefined,
        selectable: true,
        data: value,
    };

    return result;
};

/**
 * Handles the drag and drop of the {@link PasswordList}.
 * @param target The target {@link DataEntry} for the drag and drop operation.
 * @param source The source {@link DataEntry} for the drag and drop operation.
 * @param dataSource The current data source.
 * @returns A new data source with the items reordered based on the drag and drop operation or {@link undefined} if nothing was done to the passed data source.
 */
const dragDropDataSource = (target: DataEntry, source: DataEntry, dataSource: DataEntry[]) => {
    if (target.parentId === -1 && source.parentId === -1 && target.id !== source.id) {
        const newDataSource = [...dataSource];
        const targetIndex = newDataSource.findIndex(f => f.id === target.id);
        const sourceIndex = newDataSource.findIndex(f => f.id === source.id);
        newDataSource[targetIndex] = source;
        newDataSource[sourceIndex] = target;
        return newDataSource;
    }

    if (target.parentId === -1 && source.parentId !== -1) {
        const newDataSource = [...dataSource];
        const sourceIndex = newDataSource.findIndex(f => f.id === source.id);
        newDataSource[sourceIndex] = { ...source, parentId: target.id };
        return newDataSource;
    }

    if (target.parentId !== -1 && source.parentId !== -1 && target.id !== source.id) {
        const newDataSource = [...dataSource];
        const targetIndex = newDataSource.findIndex(f => f.id === target.id);
        const sourceIndex = newDataSource.findIndex(f => f.id === source.id);
        newDataSource[targetIndex] = { ...source, parentId: target.parentId };
        newDataSource[sourceIndex] = target;
        return newDataSource;
    }
};

/**
 * Determines whether the specified {@link DataEntry} is a group entry.
 * @param {DataEntry} entry The entry to check for.
 * @returns {boolean} true if the specified entry is a group / category; false otherwise.
 */
const isGroup = (entry: DataEntry) => {
    return entry.parentId === -1;
};

const StyledPasswordList = styled(PasswordList)`
    .PasswordList-tree {
        width: 100%;
        height: 100%;
    }
    .p-tree-filter-container {
        display: none;
    }
`;

export { StyledPasswordList };
