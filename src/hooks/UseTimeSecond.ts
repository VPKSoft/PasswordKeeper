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
import { TimeInterval, useTimeout } from "./UseTimeout";

/**
 * A custom hook to call a callback on specified seconds of the time.
 * @param onSeconds The seconds on which to call the callback.
 * @param callback The callback to call when one of the specified second occurs in current time.
 * @returns A function to stop / enable the hook calling the callback.
 */
const useTimeSecond = (onSeconds: Array<number>, callback: () => void): [setStopped: (value: boolean) => void] => {
    const [currentSecond, setCurrentSecond] = React.useState(new Date().getSeconds());
    const [stopped, setStopped] = React.useState(false);
    const [previousCallSecond, setPreviousCallSecond] = React.useState(-1);

    // Update the current second to the state and reset the useTimeout hook.
    const updateTime = () => {
        const second = new Date().getSeconds();
        if (currentSecond !== second) {
            setCurrentSecond(second);
        }

        if (currentSecond !== previousCallSecond) {
            setPreviousCallSecond(-1);
        }
        reset();
    };

    // Use a hook to call a callback at 50 millisecond interval.
    const [, reset] = useTimeout(50, updateTime, TimeInterval.Milliseconds);

    // If the second has changed an it was specified in the a array of seconds to call the callback
    // and the hook is not sopped:
    React.useEffect(() => {
        if (stopped) {
            return;
        }

        // Validate that the current second is included in the onSeconds parameter and the
        // callback has not yet been called for the current second.
        if (previousCallSecond !== currentSecond && onSeconds.includes(currentSecond)) {
            // Update the value of the second the callback was previously called for.
            setPreviousCallSecond(currentSecond);

            // Call the callback.
            callback();
        }
    }, [callback, currentSecond, onSeconds, previousCallSecond, stopped]);

    return [setStopped];
};

export { useTimeSecond };
