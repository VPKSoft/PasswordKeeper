import * as React from "react";
import { Button, Popup } from "devextreme-react";
import { ModifyType } from "../../types/Enums";
import styled from "styled-components";
import classNames from "classnames";
import { useLocalize } from "../../i18n";
import { DataEntry } from "../../types/PasswordEntry";
import EntryEditor from "./EntryEditor";

type Props = {
    className?: string;
    entry: DataEntry | undefined;
    mode: ModifyType;
    visible: boolean;
    onClose: (useAccepted: boolean, entry?: DataEntry | undefined) => void;
};

const EditEntryPopup = ({
    className, //
    entry,
    mode,
    visible,
    onClose,
}: Props) => {
    const [useAccepted, setUserAccepted] = React.useState(false);
    const [entryInternal, setEntryInternal] = React.useState<DataEntry | undefined>(entry);

    const le = useLocalize("entries");
    const lu = useLocalize("ui");

    const title = React.useMemo(() => (mode === ModifyType.New ? le("newEntry", "New entry") : le("modifyEntry", "Modify entry", { entry })), [entry, le, mode]);

    React.useEffect(() => {
        setEntryInternal(entry);
    }, [entry]);

    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onClose(useAccepted);
            }
            setUserAccepted(false);
        },
        [onClose, useAccepted]
    );

    const onHiding = React.useCallback(() => {
        onClose(useAccepted);
        setUserAccepted(false);
    }, [onClose, useAccepted]);

    return (
        <Popup //
            title={title}
            showCloseButton={true}
            visible={visible}
            onHiding={onHiding}
            onVisibleChange={onVisibleChange}
            dragEnabled={true}
            resizeEnabled={true}
            height={500}
            width={600}
            showTitle={true}
        >
            <div className={classNames(EditEntryPopup.name, className)}>
                <EntryEditor //
                    className="Popup-entryEditor"
                    entry={entryInternal}
                    readOnly={false}
                    onEntryChanged={setEntryInternal}
                    showGeneratePassword={true}
                />
                <div className="Popup-ButtonRow">
                    <Button //
                        text={lu("ok")}
                        onClick={() => {
                            setUserAccepted(true);
                            onClose(true, entryInternal);
                        }}
                    />
                    <Button //
                        text={lu("cancel")}
                        onClick={() => {
                            setUserAccepted(false);
                            onClose(false);
                        }}
                    />
                </div>
            </div>
        </Popup>
    );
};

export default styled(EditEntryPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
    .Popup-entryEditor {
        height: 100%;
    }
    .Popup-ButtonRow {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: flex-end;
    }
`;
