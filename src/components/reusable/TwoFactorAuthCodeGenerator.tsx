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
import { styled } from "styled-components";
import classNames from "classnames";
import { ColorHex, CountdownCircleTimer, TimeProps } from "react-countdown-circle-timer";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "devextreme-react";
import notify from "devextreme/ui/notify";
import { Auth2Fa, CommonProps } from "../Types";
import { useTimeSecond } from "../../hooks/useTimeSecond";
import { titleColor } from "../../utilities/DxUtils";
import { useLocalize } from "../../i18n";

/**
 * The props for the {@link TwoFactorAuthCodeGenerator} component.
 */
type TwoFactorAuthCodeGeneratorProps = {
    duration?: number;
    countdownTimerColor?: ColorHex;
    otpAuthUrl: string;
} & CommonProps;

/**
 * A component for generating OTPAuth codes every 30 seconds at current time second being 0 or 30.
 * @param param0 The component props: {@link TwoFactorAuthCodeGeneratorProps}.
 * @returns A component.
 */
const TwoFactorAuthCodeGenerator = ({
    className, //
    duration = 30,
    countdownTimerColor = titleColor("foreground", "#329ea3") as ColorHex,
    otpAuthUrl,
}: TwoFactorAuthCodeGeneratorProps) => {
    const lu = useLocalize("ui");

    const [durationStart, setDurationStart] = React.useState(0);
    const [reset, setReset] = React.useState(false);
    const [twoFactorResult, setTwoFactorResult] = React.useState<Auth2Fa>();

    React.useEffect(() => {
        let adjust = new Date().getSeconds();
        if (adjust > 30) {
            adjust = adjust - 30;
        }
        const newValue = duration - adjust;

        // Call the rust backend for the code generation.
        void invoke<Auth2Fa>("gen_otpauth", { otpauth: otpAuthUrl }).then((f: Auth2Fa) => {
            if (f.success) {
                setTwoFactorResult(f);
            } else {
                setTwoFactorResult({ ...f, key: "⚠⚠⚠⚠⚠⚠" });
            }
        });

        setDurationStart(newValue);
    }, [duration, otpAuthUrl]);

    // Reset the reset flag.
    React.useEffect(() => {
        if (reset) {
            setReset(false);
        }
    }, [reset]);

    // Causes the CountdownCircleTimer component to "reset" --> unmount & remount.
    const onSecond = React.useCallback(() => {
        setDurationStart(30);
        setReset(true);
    }, []);

    useTimeSecond([0, 30], onSecond);

    const renderSeconds = React.useCallback((p: TimeProps): React.ReactNode => {
        return <div className="CountDown">{p.remainingTime.toString()}</div>;
    }, []);

    // Copy the 2FA key value into the clipboard.
    const copyToClipboard = React.useCallback(() => {
        if (twoFactorResult) {
            navigator.clipboard
                .writeText(twoFactorResult.key)
                .then(() => {
                    notify(lu("clipboardCopySuccess"), "success", 5_000);
                })
                .catch(() => {
                    notify(lu("clipboardCopyFailed"), "error", 5_000);
                });
        }
    }, [lu, twoFactorResult]);

    // A callback when the CountdownCircleTimer completes.
    const onComplete = React.useCallback(() => ({ shouldRepeat: true, delay: 1 }), []);

    // Unmount the CountdownCircleTimer component by returning null when the reset flag is raised.
    if (reset) {
        void invoke<Auth2Fa>("gen_otpauth", { otpauth: otpAuthUrl }).then((f: Auth2Fa) => {
            setTwoFactorResult(f);
        });
        return null;
    }

    return (
        <div //
            className={classNames(TwoFactorAuthCodeGeneratorStyled.name, className)}
        >
            <CountdownCircleTimer //
                isPlaying={true}
                duration={durationStart}
                colors={[countdownTimerColor ?? "#004777", countdownTimerColor ?? "#004777"]}
                colorsTime={[30, 0]}
                onComplete={onComplete}
                size={60}
                strokeWidth={10}
            >
                {renderSeconds}
            </CountdownCircleTimer>
            <div className="SpaceBetween" />
            {[0, 1, 2, 3, 4, 5].map(f => (
                <div className="NumberBoxBorder" key={f}>
                    {twoFactorResult?.key?.slice(f, f + 1)}
                </div>
            ))}
            <Button //
                icon="copy"
                className="CopyButton"
                onClick={copyToClipboard}
                hint={lu("copyClipboard")}
            />
        </div>
    );
};

const TwoFactorAuthCodeGeneratorStyled = styled(TwoFactorAuthCodeGenerator)`
    display: flex;
    flex-direction: row;
    .SpaceBetween {
        margin: 10px;
    }
    .CountDown {
        color: black;
        font-weight: bolder;
    }
    .NumberBoxBorder {
        display: flex;
        border-style: solid;
        border-width: 1px;
        align-items: center;
        width: 26px;
        align-self: center;
        height: 26px;
        border-radius: 5px;
        margin-right: 4px;
        justify-content: center;
        text-align: center;
        vertical-align: middle;
    }
    .CopyButton {
        height: 36px;
        align-self: center;
    }
`;

export { TwoFactorAuthCodeGeneratorStyled };
