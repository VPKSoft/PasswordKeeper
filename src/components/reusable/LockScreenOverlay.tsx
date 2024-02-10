/*
MIT License

Copyright (c) 2024 Petteri Kautonen

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
import classNames from "classnames";
import { styled } from "styled-components";
import { CommonProps } from "../Types";

/**
 * The props for the {@link LockScreenOverlay} component.
 */
type LockScreenOverlayProps = {
    /** The text to display when the component is locking the view. */
    lockText?: string;
    /** The optional font weight for the {@link lockText}. The default is 'normal'. */
    fontWeight?: string;
    /** The optional background opacity for the component. The default is 0.5. */
    backgroundOpacity?: number;
    /** The optional background color for the overlay. The default is black. */
    backgroundColor?: string;
    /** The optional foreground color for the overlay. The default is white. */
    foreColor?: string;
    /** The optional foreground opacity for the component. The default is 1. */
    foreOpacity?: number;
    /** The optional font size for the component. The default is 'xx-large'. */
    fontSize?: string;
    /** A value indicating whether the component is visible; E.g. locked. */
    visible: boolean;
    /** Occurs when the visible lock overlay is clicked in an attempt to unlock it. */
    onClick?: () => void;
} & CommonProps;

/**
 * A component to create a window-sized lock overlay over other components in the view.
 * @param param0 The component props: {@link LockScreenOverlayProps}.
 * @returns A component.
 */
const LockScreenOverlay = ({
    className, //
    lockText,
    visible,
    onClick,
}: LockScreenOverlayProps) => {
    if (!visible) {
        return null;
    }

    return (
        <div //
            onClick={onClick}
            className={classNames(LockScreenOverlay.name, className)}
        >
            {lockText}
        </div>
    );
};

// Code derived from: https://css-tricks.com/converting-color-spaces-in-javascript/
/**
 * Creates a 'rgba(r, g, b, a)' color value from the specified hex color string and the specified opacity.
 * @param color The hex color string in format #RRGGBB.
 * @param opacity The opacity between 0 to 1.
 * @returns A 'rgba(r, g, b, a)' color value.
 */
const hexOpacityToRgba = (color: string, opacity: number) => {
    let r = "0x",
        g = "0x",
        b = "0x";

    color = color.slice(1); // Remove the starting #-character.

    if (color.length === 6) {
        r += color.slice(0, 2);
        g += color.slice(2, 4);
        b += color.slice(4, 6);
    } else if (color.length === 3) {
        r += color.slice(0, 1);
        g += color.slice(1, 2);
        b += color.slice(2, 3);
    }

    return `rgba(${Number.parseInt(r, 16)},${Number.parseInt(g, 16)},${Number.parseInt(b, 16)},${opacity})`;
};

const StyledLockScreenOverlay = styled(LockScreenOverlay)`
    // CSS Styling derived from: https://medium.com/before-semicolon/how-to-create-custom-modal-dialog-in-react-108b83e5a501
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: ${props => hexOpacityToRgba(props.backgroundColor ?? "#000000", props.backgroundOpacity ?? 0.5)};
    color: ${props => hexOpacityToRgba(props.foreColor ?? "#FFFFFF", props.foreOpacity ?? 1)};
    display: flex;
    align-content: center;
    font-weight: ${props => props.fontWeight ?? "normal"};
    font-size: ${props => props.fontSize ?? "xx-large"};
    justify-content: center;
    flex-wrap: wrap;
`;

export { StyledLockScreenOverlay };
