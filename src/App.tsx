import * as React from "react";
import "./App.css";
import { Button, Toolbar } from "devextreme-react";
import styled from "styled-components";
import "./i18n";
import "@fluentui/react-icons";
import { save, open } from "@tauri-apps/api/dialog";
import EditEntryPopup from "./components/software/EditEntryPopup";
import { DataEntry } from "./types/PasswordEntry";
import { ModifyType } from "./types/Enums";
import { useLocalize } from "./i18n";
import { Item as ToolbarItem } from "devextreme-react/toolbar";
import classNames from "classnames";
import { newEntry, testData } from "./misc/TestData";
import { setTheme } from "./utilities/ThemeUtils";
import EntryEditor from "./components/software/EntryEditor";
import PasswordList from "./components/app/PasswordList";
import { invoke } from "@tauri-apps/api/tauri";

type Props = {
    className?: string;
};

const App = ({ className }: Props) => {
    const [entry, setEntry] = React.useState<DataEntry | undefined>();
    const [entryEditVisible, setEntryEditVisible] = React.useState(true);
    const [dataSource, setDataSource] = React.useState(testData);
    const la = useLocalize("app");

    setTheme("generic.carmine");

    const saveDialog = React.useCallback(async () => {
        const filePath = await save({
            filters: [
                {
                    name: la("passwordKeeperDataFile", "PasswordKeeper data file"),
                    extensions: ["pkd"],
                },
            ],
        });
        console.log(filePath);
        const saveData = JSON.stringify(dataSource);
        //TODO::Create new database for the file.
        void invoke("save_file", { jsonData: saveData, fileName: filePath }).then(result => console.log(result));
    }, [dataSource, la]);

    const loadDialog = React.useCallback(async () => {
        const filePath = await open({
            filters: [
                {
                    name: la("passwordKeeperDataFile", "PasswordKeeper data file"),
                    extensions: ["pkd"],
                },
            ],
        });
        console.log(filePath);
        const saveData = JSON.stringify(dataSource);
        //TODO::Create new database for the file.
        void invoke("load_file", { fileName: filePath }).then(v => {
            console.log(v);
        });
    }, [dataSource, la]);

    const onEditClose = React.useCallback((useAccepted: boolean, entry?: DataEntry | undefined) => {
        if (useAccepted) {
            // TODO::Save the data
        }
        setEntryEditVisible(false);
    }, []);

    return (
        <div className={classNames(App.name, className)}>
            <Toolbar>
                <ToolbarItem location="before">
                    <Button //
                        icon="add"
                        onClick={() => setEntryEditVisible(true)}
                        disabled={entry === undefined}
                    />
                </ToolbarItem>
                <ToolbarItem location="before">
                    <Button //
                        icon="save"
                        onClick={saveDialog}
                    />
                </ToolbarItem>
                <ToolbarItem location="before">
                    <Button //
                        icon="folder"
                        onClick={loadDialog}
                    />
                </ToolbarItem>
                <ToolbarItem location="before">
                    <Button //
                        icon="help"
                        //onClick={() => console.log(newEntry(entry?.parentId === -1 ? entry.id : entry.parentId, dataSource, le("newEntry")))}
                        //                        onClick={loadDialog}
                    />
                </ToolbarItem>
            </Toolbar>
            <div className="App-itemsWiew">
                <PasswordList //
                    dataSource={dataSource}
                    setDataSource={setDataSource}
                    className="App-itemsWiew-list"
                    setEntry={setEntry}
                />
                <EntryEditor //
                    className="App-PasswordEntryEditor"
                    entry={entry}
                    readOnly={true}
                    visible={entry?.parentId !== -1}
                    hidePasswordTimeout={10}
                    showCopyButton={true}
                />
            </div>
            <EditEntryPopup //
                entry={entry}
                mode={ModifyType.Edit}
                visible={entryEditVisible}
                onClose={onEditClose}
            />
        </div>
    );
};

export default styled(App)`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction column;
    .App-itemsWiew {
        display: flex;
        height: 100%;
        width: 100%;
        flex-direction row;
        min-height: 0;
    }
    .App-PasswordEntryEditor {
        width: 60%;
        margin: 10px;
    }
    .App-itemsWiew-list {
        width: 40%;
    }
`;
