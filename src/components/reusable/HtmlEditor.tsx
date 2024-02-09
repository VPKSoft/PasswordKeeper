import * as React from "react";
import { styled } from "styled-components";
import classNames from "classnames";
import JoditEditor from "jodit-react";
import { Jodit } from "jodit/esm/jodit";
import { CommonProps } from "../Types";
import { useFontFamily } from "../../hooks/UseFontFamily";

/**
 * The props for the {@link HtmlEditor} component.
 */
type HtmlEditorProps = {
    onChange: (value: string) => void;
    value: string | undefined;
    height?: string | number;
} & CommonProps;

/**
 * A  component ...
 * @param param0 The component props: {@link HtmlEditorProps}.
 * @returns A component.
 */
const HtmlEditor = ({
    className, //
    value,
    height,
    onChange,
}: HtmlEditorProps) => {
    const editor = React.useRef<Jodit>(null);
    const [fontFamilies] = useFontFamily();

    const fontsObject = React.useMemo(() => {
        const joditFamilies: { [key: string]: string } = {};
        for (const f of fontFamilies) {
            joditFamilies[f] = f;
        }

        return joditFamilies;
    }, [fontFamilies]);

    const joditConfig = React.useMemo(() => {
        return {
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            placeholder: "",
            controls: {
                font: {
                    list: Jodit.atom({
                        ...fontsObject,
                    }),
                },
            },
            height: height,
            uploader: {
                insertImageAsBase64URI: true,
            },
        };
    }, [fontsObject, height]);

    return (
        <div className={classNames(HtmlEditor.name, className)}>
            <JoditEditor
                ref={editor}
                value={value ?? ""}
                config={joditConfig}
                onBlur={onChange} // preferred to use only this option to update the content for performance reasons
                onChange={emptyFunc}
            />
        </div>
    );
};

const emptyFunc = () => {};

const HtmlEditorStyled = styled(HtmlEditor)`
    width: 100%;
    height: 100%;
    .jodit-react-container {
        overflow: auto;
    }
    .jodit-status-bar-link {
        display: none;
    }
`;

export { HtmlEditorStyled };
