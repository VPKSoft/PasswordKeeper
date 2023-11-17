import * as React from "react";
import { styled } from "styled-components";
import classNames from "classnames";
import { Popup } from "devextreme-react";
import { CommonProps } from "../../Types";
import { DataEntry } from "../../../types/PasswordEntry";

/**
 * The props for the {@link NotesEditorPopup} component.
 */
type NotesEditorPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** The current {@link DataEntry} value which is an item, NOT a category. */
    entry?: DataEntry | null;
    /** A value indicating whether to use HTML on entry editing and rendering. */
    useHtmlOnNotes?: boolean;
} & CommonProps;

/**
 * A  component ...
 * @param param0 The component props: {@link NotesEditorPopupProps}.
 * @returns A component.
 */
const NotesEditorPopup = ({
    className, //
}: NotesEditorPopupProps) => {
    return (
        <Popup //
            className={classNames(NotesEditorPopup.name, className)}
            height={500}
            width={700}
        ></Popup>
    );
};

const NotesEditorPopupStyled = styled(NotesEditorPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export { NotesEditorPopupStyled };
