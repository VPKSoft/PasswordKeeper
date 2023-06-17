import * as React from "react";
import applyChanges from "devextreme/data/apply_changes";
import { TreeList } from "devextreme-react";
import { Column, FilterRow, RowDragging, Selection } from "devextreme-react/tree-list";
import dxTreeList, { Node, RowDraggingChangeEvent, RowDraggingReorderEvent, SelectionChangedEvent, SavingEvent, InitializedEvent } from "devextreme/ui/tree_list";
import { Template } from "devextreme-react/core/template";
import classNames from "classnames";

import styled from "styled-components";
import { useLocalize } from "../../i18n";
import { DataEntry } from "../../types/PasswordEntry";
import { CommonProps } from "../Types";

/**
 * The props for the {@link PasswordList} component.
 */
type PasswordListProps = {
    /** The data source for the component. */
    dataSource: DataEntry[];
    /** The ref for the component's TreeList component. */
    treeListRef?: React.MutableRefObject<dxTreeList | undefined>;
    /** Occurs when the selected item has been changed. */
    setEntry: (value: DataEntry | null) => void;
    /** A callback to pass the changed data source to the parent component. */
    setDataSource: (dataSource: DataEntry[]) => void;
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
    treeListRef,
    setEntry,
    setDataSource,
}: PasswordListProps) => {
    const le = useLocalize("entries");

    // Order the data by setting the SortOrder and ParentId properties.
    const onReorder = React.useCallback(
        (e: RowDraggingReorderEvent) => {
            if (dataSource) {
                setDataSource(reorderData(e, dataSource));
            }
        },
        [dataSource, setDataSource]
    );

    // Raise the setEntry callback when the TreeList selection has been changed.
    const onSelectionChanged = React.useCallback(
        (e: SelectionChangedEvent<DataEntry>) => {
            const selected = e.selectedRowsData.length > 0 ? e.selectedRowsData[0] : null;
            setEntry(selected);
        },
        [setEntry]
    );

    // A custom save to disallow direct prop value mutation.
    const onSaving = React.useCallback(
        (e: SavingEvent) => {
            e.cancel = true;
            const newData = applyChanges(dataSource, e.changes, { immutable: true });
            setDataSource(newData);
        },
        [dataSource, setDataSource]
    );

    // Save the ref for the tree list.
    const onInitialized = React.useCallback(
        (e: InitializedEvent) => {
            if (treeListRef) {
                treeListRef.current = e.component;
            }
        },
        [treeListRef]
    );

    return (
        <TreeList //
            className={classNames(PasswordList.name, className)}
            dataSource={dataSource}
            keyExpr="id"
            parentIdExpr="parentId"
            rootValue={-1}
            onInitialized={onInitialized}
            showRowLines={true}
            showBorders={true}
            onSelectionChanged={onSelectionChanged}
            onSaving={onSaving}
        >
            <Selection mode="single" />
            <FilterRow visible={true} />
            <RowDragging //
                allowReordering={true}
                onReorder={onReorder}
                onDragChange={onDragChange}
                allowDropInsideItem={true}
            />
            <Column //
                dataField="parentId"
                cellTemplate="columnTypeTemplate"
                caption=""
                width={90}
            />

            <Column //
                dataField="name"
                caption={le("name")}
                dataType="string"
            />
            <Template name="columnTypeTemplate" render={renderColumnType} />
        </TreeList>
    );
};

/**
 * The type for the {@link TreeList} column {@link Template} rendering callback.
 */
type RenderColumnData = {
    row: {
        data: DataEntry;
    };
};

/**
 * Renders the icon to the {@link PasswordList} component.
 * @param {RenderColumnData} e The column data passed to the callback.
 * @returns {JSX.Element} for the column cell contents.
 */
const renderColumnType = (e: RenderColumnData) => {
    return e.row.data.parentId === -1 ? <div className="fas fa-folder PasswordList-imageCell" /> : <div className="fas fa-tag App-itemsWiew-list-imageCell" />;
};

/**
 * Determines whether the specified {@link DataEntry} is a group entry.
 * @param {DataEntry} entry The entry to check for.
 * @returns {boolean} true if the specified entry is a group / category; false otherwise.
 */
const isGroup = (entry: DataEntry) => {
    return entry.parentId === -1;
};

/**
 * Validate the drag change of the {@link TreeList} for the {@link PasswordList} component.
 * @param {RowDraggingChangeEvent} e The event data for the row dragging event.
 */
const onDragChange = (e: RowDraggingChangeEvent) => {
    const visibleRows = e.component.getVisibleRows();

    const sourceNode = visibleRows[e.fromIndex].node;
    const targetNode = visibleRows[e.toIndex].node;

    if (
        targetNode.data.id === sourceNode.data.id || // Can not drag to it self.
        (e.dropInsideItem && !isGroup(targetNode.data)) || // Can not drag an item into a non-group.
        (e.dropInsideItem && isGroup(sourceNode.data)) || // Can not draw group into an item.
        // Can not drop item into a group if it is not being dropped inside a group.
        (isGroup(targetNode.data) && !isGroup(sourceNode.data) && !e.dropInsideItem) ||
        // Cannot drop group inside another group.
        (isGroup(sourceNode.data) && isGroup(targetNode.data) && e.dropInsideItem) ||
        // Can not drop group outside a non-group item.
        (isGroup(sourceNode.data) && !isGroup(targetNode.data) && !e.dropInsideItem)
    ) {
        e.cancel = true;
        return;
    }
};

/**
 * Reorders the data source items after the {@link RowDragging} onReorder event.
 * @param {RowDraggingChangeEvent} e The event data for the row dragging event.
 * @param {Array<DataEntry>} dataSource The current data source of the {@link TreeList}.
 * @returns {Array<DataEntry>} The reordered data source.
 */
const reorderData = (e: RowDraggingReorderEvent, dataSource: Array<DataEntry>) => {
    const sourceData = e.itemData;
    const targetIndex = dataSource.findIndex(i => i.id === e.itemData.id);

    const visibleRows = e.component.getVisibleRows() as unknown as { data: DataEntry; node: Node<DataEntry> }[];
    const targetNode: Node<DataEntry> = visibleRows[e.toIndex].node;
    let sourceIndex = dataSource.findIndex(i => i.id === targetNode.key);

    if (e.fromIndex > e.toIndex && targetIndex < sourceIndex) {
        sourceIndex = sourceIndex - 1;
    }

    const newItem: DataEntry = e.dropInsideItem ? { ...sourceData, parentId: targetNode.key } : { ...sourceData, parentId: targetNode.parent?.key ?? -1 };

    let newData = dataSource;
    newData = [...dataSource.slice(0, targetIndex), ...dataSource.slice(targetIndex + 1)];
    newData = [...newData.slice(0, sourceIndex), newItem, ...newData.slice(sourceIndex)];

    return newData;
};

export default styled(PasswordList)`
    .PasswordList-imageCell {
        display: flex;
        align-items: center;
        flex-flow: column;
    }
`;
