import * as React from "react";
import applyChanges from "devextreme/data/apply_changes";
import { TreeList } from "devextreme-react";
import { Column, FilterRow, RowDragging, Selection } from "devextreme-react/tree-list";
import { Node, RowDraggingChangeEvent, RowDraggingReorderEvent, SelectionChangedEvent, SavingEvent } from "devextreme/ui/tree_list";
import { Template } from "devextreme-react/core/template";
import classNames from "classnames";

import styled from "styled-components";
import { useLocalize } from "../../i18n";
import { DataEntry } from "../../types/PasswordEntry";

type Props = {
    className?: string;
    dataSource: DataEntry[];
    setEntry: (value: DataEntry | null) => void;
    setDataSource: (datasource: DataEntry[]) => void;
};

const PasswordList = ({
    className, //
    dataSource,
    setEntry,
    setDataSource,
}: Props) => {
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

    const onSelectionChanged = React.useCallback(
        (e: SelectionChangedEvent<DataEntry>) => {
            const selected = e.selectedRowsData.length > 0 ? e.selectedRowsData[0] : null;
            setEntry(selected);
        },
        [setEntry]
    );

    const onSaving = React.useCallback(
        (e: SavingEvent) => {
            e.cancel = true;
            const newData = applyChanges(dataSource, e.changes, { immutable: true });
            setDataSource(newData);
        },
        [dataSource, setDataSource]
    );

    return (
        <TreeList //
            className={classNames(PasswordList.name, className)}
            //    className="App-itemsWiew-list"
            dataSource={dataSource}
            keyExpr="id"
            parentIdExpr="parentId"
            rootValue={-1}
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

const renderColumnType = (e: { row: { data: DataEntry } }) => {
    return e.row.data.parentId === -1 ? <div className="fas fa-folder PasswordList-imageCell" /> : <div className="fas fa-tag App-itemsWiew-list-imageCell" />;
};

const isGroup = (entry: DataEntry) => {
    return entry.parentId === -1;
};

const onDragChange = (e: RowDraggingChangeEvent) => {
    const visibleRows = e.component.getVisibleRows();

    const sourceNode = visibleRows[e.fromIndex].node;
    const targetNode = visibleRows[e.toIndex].node;

    if (
        targetNode.data.id === sourceNode.data.id ||
        (e.dropInsideItem && !isGroup(targetNode.data)) ||
        (e.dropInsideItem && isGroup(sourceNode.data)) ||
        (isGroup(targetNode.data) && !isGroup(sourceNode.data) && !e.dropInsideItem) ||
        (isGroup(sourceNode.data) && isGroup(targetNode.data) && e.dropInsideItem) ||
        (isGroup(sourceNode.data) && !isGroup(targetNode.data) && !e.dropInsideItem)
    ) {
        e.cancel = true;
        return;
    }
};

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
