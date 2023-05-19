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

import * as React from "react";
import { Button, Popup } from "devextreme-react";
import styled from "styled-components";
import classNames from "classnames";
import dxTextBox from "devextreme/ui/text_box";
import { ModifyType } from "../../../types/Enums";
import { useLocalize } from "../../../i18n";
import { DataEntry } from "../../../types/PasswordEntry";
import EntryEditor from "../EntryEditor";

type Props = {
    className?: string;
    entry: DataEntry | undefined;
    mode: ModifyType;
    visible: boolean;
    onClose: (userAccepted: boolean, entry?: DataEntry | undefined) => void;
};

const EditEntryPopup = ({
    className, //
    entry,
    mode,
    visible,
    onClose,
}: Props) => {
    const [userAccepted, setUserAccepted] = React.useState(false);
    const [entryInternal, setEntryInternal] = React.useState<DataEntry | undefined>();
    const focusTextBoxRef = React.useRef<dxTextBox>();

    const le = useLocalize("entries");
    const lu = useLocalize("ui");

    const title = React.useMemo(() => (mode === ModifyType.New ? le("newEntry", "New entry") : le("modifyEntry", "Modify entry", { entry })), [entry, le, mode]);

    React.useEffect(() => {
        setEntryInternal(entry);
    }, [entry]);

    const onVisibleChange = React.useCallback(
        (visible: boolean) => {
            if (!visible) {
                onClose(userAccepted);
            }
            setUserAccepted(false);
        },
        [onClose, userAccepted]
    );

    const onHiding = React.useCallback(() => {
        onClose(userAccepted);
        setUserAccepted(false);
    }, [onClose, userAccepted]);

    const popupShown = React.useCallback(() => {
        focusTextBoxRef.current?.focus();
    }, []);

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
            onShown={popupShown}
        >
            <div className={classNames(EditEntryPopup.name, className)}>
                <EntryEditor //
                    className="Popup-entryEditor"
                    entry={entryInternal}
                    readOnly={false}
                    onEntryChanged={setEntryInternal}
                    showGeneratePassword={true}
                    nameTextBoxRef={focusTextBoxRef}
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
