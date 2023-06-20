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

/**
 * A type for something that has a focus function as a member.
 */
type Focusable = {
    /** Focuses the compoentn. */
    focus: () => void;
};

/**
 * A type for DevExtreme component {@link onInitialized} event.
 */
type DxInitializedEvent = {
    /** The component which can be focused. */
    component: Focusable;
};

/**
 * A custom hook to help focus a specific DevExtreme component.
 * @param dxInitialized An optional callback for the {@link dxComponent.onInitialized} event.
 * @returns A function to focus the component, the onInitialized event for the component to focus and a ref for the component.
 */
export const useFocus = (dxInitialized?: (e: never) => void): [() => void, (e: unknown) => void, React.MutableRefObject<Focusable | undefined>] => {
    const focusRef = React.useRef<Focusable>();

    const setFocus = React.useCallback(() => {
        focusRef.current?.focus();
    }, []);

    const onInitialized = React.useCallback(
        (e: unknown) => {
            focusRef.current = (e as DxInitializedEvent).component;
            dxInitialized?.(e as never);
        },
        [dxInitialized]
    );

    return [setFocus, onInitialized, focusRef];
};
