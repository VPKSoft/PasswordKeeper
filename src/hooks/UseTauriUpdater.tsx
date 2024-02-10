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

import { relaunch } from "@tauri-apps/api/process";
import { UpdateManifest, UpdateResult, checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import * as React from "react";
import { useLocalize } from "../i18n";

/** A value indicating whether the application should update it self. `null` value indicates an unresolved status, `undefined` indicates an error status. */
type ShouldUpdate = boolean | null | undefined;

/** The Tauri update manifest data. `null` value indicates an unresolved status, `undefined` indicates an error status. */
type Manifest = UpdateManifest | undefined | null;
/** Re-check the the application updates. */
type ReCheck = () => void;
/** Updates the app and relaunches the app afterwards. */
type Update = () => Promise<void>;

/**
 * A result data for the {@link useTauriUpdater} hook.
 */
type TauriUpdaterResult = [shouldUpdate: ShouldUpdate, manifest: Manifest, reCheck: ReCheck, update: Update, checkError: boolean, errorMessage: string];

/**
 * A custom hook for Tauri updater check. See: https://tauri.app/v1/api/js/updater.
 * @param {boolean} passive A value indicating whether the hook should be in stale state. E.g. not do anything unless requested.
 * @returns {TauriUpdaterResult} With the status data and necessary callbacks.
 */
const useTauriUpdater = (passive: boolean, retryCount: number = 5): TauriUpdaterResult => {
    const [shouldUpdate, setShouldUpdate] = React.useState<boolean | null | undefined>(null);
    const [manifest, setManifest] = React.useState<UpdateManifest | undefined | null>(null);
    const [checkError, setCheckError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const lm = useLocalize("messages");

    const shouldRetry = React.useRef<boolean>(false);
    const retries = React.useRef(0);

    // An internal call back to check for updates.
    const checkUpdateInternal = React.useCallback(() => {
        checkUpdate()
            .then((updateResult: UpdateResult) => {
                setShouldUpdate(updateResult.shouldUpdate);
                setManifest(updateResult.manifest ?? null);
                setCheckError(false);
                retries.current = 0;
                setErrorMessage("");
                shouldRetry.current = false;
            })
            .catch(error => {
                // eslint-disable-next-line unicorn/no-useless-undefined
                setShouldUpdate(undefined);
                // eslint-disable-next-line unicorn/no-useless-undefined
                setManifest(undefined);
                setCheckError(true);
                retries.current++;
                shouldRetry.current = retries.current < retryCount;
                setErrorMessage(lm("updateCheckFailed", "File open failed with message '{{error}}'.", { error: error }));
            });
    }, [lm, retries, retryCount]);

    const checkUpdateExternal = React.useCallback(() => {
        retries.current = 0;
        shouldRetry.current = true;
        checkUpdateInternal();
    }, [checkUpdateInternal]);

    // Check for updates.
    React.useEffect(() => {
        if (!passive || (shouldRetry.current && retries.current < retryCount)) {
            checkUpdateInternal();
        }
    }, [checkUpdateInternal, passive, retryCount]);

    React.useEffect(() => {
        const timeout = setInterval(() => {
            if (!passive || (shouldRetry.current && retries.current < retryCount)) {
                checkUpdateInternal();
            }
        }, 5_000);

        return () => clearInterval(timeout);
    }, [checkUpdateInternal, passive, retryCount]);

    const updateCallback = React.useCallback(() => {
        return installUpdate().then(relaunch);
    }, []);

    return [shouldUpdate, manifest, checkUpdateExternal, updateCallback, checkError, errorMessage];
};

export { useTauriUpdater };

export type { TauriUpdaterResult };

export type { UpdateStatusResult } from "@tauri-apps/api/updater";
