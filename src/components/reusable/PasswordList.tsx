import * as React from "react";
import classNames from "classnames";
import { styled } from "styled-components";
import type { DataNode, EventDataNode } from "antd/es/tree";
import Tree from "antd/es/tree/Tree";
import { FolderOpenOutlined, TagsOutlined } from "@ant-design/icons";
import { DataEntry } from "../../types/PasswordEntry";
import { CommonProps } from "../Types";
import { SearchMode, SearchTextBoxValue } from "./inputs/SearchTextBox";

/**
 * The props for the {@link PasswordList} component.
 */
type PasswordListProps = {
    /** The data source for the component. */
    dataSource: DataEntry[];
    /** A search value for filtering the password list. */
    searchValue: SearchTextBoxValue;
    /** The expanded node keys. */
    expandedKeys: Array<string>;
    /** An identifier to added, updated or deleted data entry. */
    lastAddedDeletedId: number;
    /** Set the identifier to added, updated or deleted data entry. */
    setLastAddedDeletedId: (value: number) => void;
    /** Set the expanded node keys. */
    setExpandedKeys: (value: Array<string>) => void;
    /** Occurs when the selected item has been changed. */
    setEntry: (value: DataEntry | null) => void;
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
    lastAddedDeletedId,
    setLastAddedDeletedId,
    setExpandedKeys,
    setEntry,
}: PasswordListProps) => {
    const [selectedKey, setSelectedKey] = React.useState<string>();

    // Memoize a suitable data source for the Tree.
    const treeData = React.useMemo(() => {
        let parents = dataSource.filter(f => f.parentId === -1);
        let children = dataSource.filter(f => f.parentId !== -1);
        parents = parents.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
        children = children.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));

        const searching = searchValue.value.trim() !== "";

        if (searching) {
            switch (searchValue.searchMode) {
                case SearchMode.And: {
                    children = children.filter(f => filterAnd(f, searchValue.value));
                    break;
                }

                case SearchMode.Or: {
                    children = children.filter(f => filterOr(f, searchValue.value));
                    break;
                }

                default: {
                    children = children.filter(f => filterOr(f, searchValue.value));
                }
            }
        }
        let result = parents.map(f => createNode(f, children));
        if (searching) {
            result = result.filter(f => f.children && f.children.length > 0);
        }

        return result;
    }, [dataSource, searchValue]);

    // Expand all search results if any results were found.
    React.useEffect(() => {
        if (searchValue.value.trim() !== "" && treeData.length > 0) {
            setExpandedKeys(treeData.map(f => f.key.toString()));
        }
    }, [searchValue, setExpandedKeys, treeData]);

    // Handle tree expand when items are added, update or deleted.
    React.useEffect(() => {
        if (lastAddedDeletedId > 0) {
            const data = treeData.find(f => f.data.id === lastAddedDeletedId)?.data;

            let childData: DataEntry | undefined;

            for (const parents of treeData) {
                childData = (parents.children as (DataNode & { data: DataEntry })[])?.find(f => f.data.id === lastAddedDeletedId)?.data;
                if (childData) {
                    break;
                }
            }

            if (childData) {
                setExpandedKeys([...new Set([...expandedKeys, childData.parentId.toString()])]);
                setSelectedKey(childData.id.toString());
            }

            if (data) {
                setExpandedKeys([...new Set([...expandedKeys, data.id.toString()])]);
                setSelectedKey(data.id.toString());
            }

            if (!data && !childData) {
                const newExpandedRowKeys = [...expandedKeys];
                const removeIndex = newExpandedRowKeys.indexOf(lastAddedDeletedId.toString());
                if (removeIndex !== -1) {
                    newExpandedRowKeys.splice(removeIndex, 1);
                    setExpandedKeys(newExpandedRowKeys);
                }
            }

            setLastAddedDeletedId(0);
        }
    }, [expandedKeys, lastAddedDeletedId, setExpandedKeys, setLastAddedDeletedId, treeData]);

    // Raise the setEntry callback when the TreeList selection has been changed.
    const onSelectionChanged = React.useCallback(
        (
            _: unknown,
            info: {
                event: "select";
                selected: boolean;
                node: EventDataNode<DataNode>;
                selectedNodes: DataNode[];
                nativeEvent: MouseEvent;
            }
        ) => {
            const selected = info.selectedNodes.length > 0 ? (info.selectedNodes[0] as DataNode & { data: DataEntry }) : null;
            if (selected?.data) {
                setEntry(selected?.data);
                setSelectedKey(selected?.data.id.toString());
            }
        },
        [setEntry]
    );

    const onExpand = React.useCallback(
        (expandedKeys: React.Key[]) => {
            setExpandedKeys(expandedKeys as string[]);
        },
        [setExpandedKeys]
    );

    return (
        <Tree //
            className={classNames(PasswordList.name, className)}
            showIcon
            defaultExpandAll
            selectedKeys={selectedKey ? [selectedKey] : undefined}
            onExpand={onExpand}
            treeData={treeData}
            onSelect={onSelectionChanged}
            expandedKeys={expandedKeys}
        />
    );
};

/**
 * Creates a {@link TreeNode} from the specified entry and data source.
 * @param value The value to create a {@link TreeNode} from.
 * @param values The data source to use for possible node children.
 * @returns A {@link TreeNode} created from the specified {@link DataEntry}.
 */
const createNode = (value: DataEntry, values: DataEntry[]) => {
    const result: DataNode & { data: DataEntry } = {
        title: value.name,
        key: value.id.toString(),
        icon: isGroup(value) ? <FolderOpenOutlined /> : <TagsOutlined />,
        children: isGroup(value) ? values.filter(f => f.parentId === value.id).map(f => createNode(f, values)) : undefined,
        selectable: true,
        data: value,
    };

    return result;
};

/**
 * Determines whether the specified {@link DataEntry} is a group entry.
 * @param {DataEntry} entry The entry to check for.
 * @returns {boolean} true if the specified entry is a group / category; false otherwise.
 */
const isGroup = (entry: DataEntry) => {
    return entry.parentId === -1;
};

const filterAnd = (value: DataEntry, search: string) => {
    const findStrings = search.split(" ").map(f => f.trim().toLowerCase());
    if (findStrings.length === 0) {
        return false;
    }

    let result = true;
    const searchLower = `${value.address} ${value.domain} ${value.name} ${value.notes} ${value.otpAuthKey} ${value.password} ${value.tags} ${value.userName}`.toLowerCase();
    for (const searchPart of findStrings) {
        if (searchLower.includes(searchPart)) {
            continue;
        }

        result = false;
        break;
    }

    return result;
};

const filterOr = (value: DataEntry, search: string) => {
    const findStrings = search.split(" ").map(f => f.trim().toLowerCase());

    const searchLower = `${value.address} ${value.domain} ${value.name} ${value.notes} ${value.otpAuthKey} ${value.password} ${value.tags} ${value.userName}`.toLowerCase();
    return findStrings.some(f => searchLower.includes(f));
};

const StyledPasswordList = styled(PasswordList)`
    .PasswordList-imageCell {
        display: flex;
        align-items: center;
        flex-flow: column;
    }
`;

export { StyledPasswordList };
