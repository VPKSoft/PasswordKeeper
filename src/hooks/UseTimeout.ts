import * as React from "react";

export enum TimeInterval {
    Milliseconds,
    Seconds,
    Minutes,
    Hours,
    Days,
}

/**
 * A custom hook to call the specified callback in a specified time interval.
 * @param interval The time interval in specified @see intervalType.
 * @param callback The callback function.
 * @param intervalType The type of the time interval. The default is @see TimeInterval.Milliseconds.
 * @param resetOnUserInteraction A value indicating whether the user interaction should be followed and reset the timer in case of an interaction.
 * @returns A function to set the enabled state of the continuous callback and a function to reset the timeout.
 */
const useTimeout = (
    //
    interval: number,
    callback: () => void,
    intervalType: TimeInterval = TimeInterval.Milliseconds,
    resetOnUserInteraction?: boolean
): //
[(enabled: boolean) => void, () => void] => {
    const [enabled, setEnabled] = React.useState(true);
    const [resetState, setResetState] = React.useState(false);

    const resetCallback = React.useCallback(() => {
        setResetState(state => !state);
    }, []);

    React.useEffect(() => {
        if (resetOnUserInteraction === true) {
            addEventListener("mousemove", resetCallback);
            addEventListener("keydown", resetCallback);
            addEventListener("keyup", resetCallback);
            addEventListener("keypress", resetCallback);
            addEventListener("mousedown", resetCallback);
            addEventListener("mouseup", resetCallback);
        } else {
            removeEventListener("mousemove", resetCallback);
            removeEventListener("keydown", resetCallback);
            removeEventListener("keyup", resetCallback);
            removeEventListener("keypress", resetCallback);
            removeEventListener("mousedown", resetCallback);
            removeEventListener("mouseup", resetCallback);
        }
    }, [resetCallback, resetOnUserInteraction]);

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

    React.useEffect(() => {
        if (enabled) {
            const timeout = setTimeout(() => {
                callback();
            }, intervalInternal);

            return () => clearTimeout(timeout);
        }
    }, [callback, interval, enabled, resetState, intervalInternal]);

    return [setEnabled, resetCallback];
};

export default useTimeout;
