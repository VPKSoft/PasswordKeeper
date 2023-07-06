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
 * An enumeration for a time interval type.
 */
export enum TimeInterval {
    /** The time interval is in milliseconds. */
    Milliseconds,
    /** The time interval is in seconds. */
    Seconds,
    /** The time interval is in minutes. */
    Minutes,
    /** The time interval is in hours. */
    Hours,
    /** The time interval is in days. */
    Days,
}

/**
 * A custom hook to call the specified callback in a specified time interval.
 * @param interval The time interval in specified {@link intervalType}.
 * @param callback The callback function.
 * @param intervalType The type of the time interval. The default is {@link TimeInterval.Milliseconds}.
 * @returns A function to set the enabled state of the continuous callback and a function to reset the timeout.
 */
const useTimeout = (
    //
    interval: number,
    callback: () => void,
    intervalType: TimeInterval = TimeInterval.Milliseconds
): //
[(enabled: boolean) => void, () => void] => {
    const [enabled, setEnabled] = React.useState(true);
    const [resetState, setResetState] = React.useState(false);

    // Convert the interval to integral milliseconds.
    const intervalInternal = React.useMemo(() => {
        switch (intervalType) {
            case TimeInterval.Milliseconds: {
                return Math.trunc(interval);
            }
            case TimeInterval.Seconds: {
                return Math.trunc(interval * 1_000);
            }
            case TimeInterval.Minutes: {
                return Math.trunc(interval * 1_000 * 60);
            }
            case TimeInterval.Hours: {
                return Math.trunc(interval * 1_000 * 60 * 60);
            }
            case TimeInterval.Days: {
                return Math.trunc(interval * 1_000 * 60 * 60 * 24);
            }
            default: {
                return Math.trunc(interval);
            }
        }
    }, [interval, intervalType]);

    const reset = React.useCallback(() => {
        setResetState(state => !state);
    }, []);

    React.useEffect(() => {
        if (enabled && intervalInternal > 0) {
            const timeout = setTimeout(() => {
                callback();
            }, intervalInternal);

            return () => clearTimeout(timeout);
        }
    }, [callback, interval, enabled, resetState, intervalInternal]);

    return [setEnabled, reset];
};

export { useTimeout };
