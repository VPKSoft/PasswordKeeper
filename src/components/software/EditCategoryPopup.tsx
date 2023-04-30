import * as React from "react";
import { Button, Popup, TextBox } from "devextreme-react";
import { ModifyType } from "../../types/Enums";
import styled from "styled-components";
import classNames from "classnames";
import { useLocalize } from "../../i18n";
import { DataEntry } from "../../types/PasswordEntry";
import { ValueChangedEvent } from "devextreme/ui/text_box";

type Props = {
    className?: string;
    entry: DataEntry;
    mode: ModifyType;
    visible: boolean;
    onClose: (useAccepted: boolean, entry?: DataEntry | undefined) => void;
};

const EditCategoryPopup = ({
    className, //
    entry,
    mode,
    visible,
    onClose,
}: Props) => {
    const [useAccepted, setUserAccepted] = React.useState(false);
    const [categoryInternal, setCategoryInternal] = React.useState<DataEntry>(entry);

    const le = useLocalize("entries");
    const lu = useLocalize("ui");

    const title = React.useMemo(() => "RENAME CATEGORY", []);

    React.useEffect(() => {
        setCategoryInternal(entry);
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

    const onNameChanged = React.useCallback(
        (e: ValueChangedEvent) => {
            const value: string = typeof e.value === "string" ? e.value : "";
            setCategoryInternal({ ...categoryInternal, name: value });
        },
        [categoryInternal]
    );

    return (
        <Popup //
            title={title}
            showCloseButton={true}
            visible={visible}
            onHiding={onHiding}
            onVisibleChange={onVisibleChange}
            dragEnabled={true}
            resizeEnabled={true}
            height={200}
            width={600}
            showTitle={true}
        >
            <div className={classNames(EditCategoryPopup.name, className)}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div className="dx-field-item-label-text">{le("name")}</div>
                            </td>
                            <td>
                                <TextBox value={entry?.name} onValueChanged={onNameChanged} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="Popup-ButtonRow">
                    <Button //
                        text={lu("ok")}
                        onClick={() => {
                            setUserAccepted(true);
                            onClose(true, categoryInternal);
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

export default styled(EditCategoryPopup)`
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
