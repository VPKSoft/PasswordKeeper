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

import { type } from "@tauri-apps/plugin-os";
import { ConfigProvider, type GlobalToken, theme } from "antd";
import * as React from "react";

/**
 * The type for the theming context payload.
 */
type ThemeContextPayload = {
    setTheme: ((value: "dark" | "light") => void) | null;
    updateBackround: ((token: GlobalToken) => void) | null;
    antdTheme: "dark" | "light";
};

/**
 * The context for the theming.
 */
const ThemeContext = React.createContext<ThemeContextPayload>({
    setTheme: null,
    updateBackround: null,
    antdTheme: "light",
});

const osType = type();
const mobile = osType === "ios" || osType === "android";

type Props = {
    children?: React.ReactNode;
};

/**
 * A custom hook for the theme token.
 */
const { useToken } = theme;

/**
 * A component for the antd theme changing at runtime.
 * @param param0 The children for the component.
 * @returns {JSX.Element} The rendered component.
 */
const AntdThemeProvider = ({ children }: Props) => {
    const [antdTheme, setAntdTheme] = React.useState<"dark" | "light">("light");

    const setTheme = React.useCallback((value: "dark" | "light") => {
        setAntdTheme(value);
    }, []);

    // Updates the background colors of the body and root elements.
    // Combine this with useEffect hook using useToken hook's return value as a dependency.
    const updateBackround = React.useCallback(
        (token: GlobalToken) => {
            const body = document.querySelector("body");
            if (body) {
                body.style.backgroundColor = antdTheme === "dark" ? "black" : "white";
                const root = document.querySelector("#root") as HTMLElement;

                if (root) {
                    root.style.backgroundColor = token.colorPrimaryBg;
                    root.style.color = token.colorPrimary;
                }
            }
        },
        [antdTheme]
    );

    // Effect to change the title bar height for mobile devices upon mounting.
    React.useEffect(() => {
        if (mobile) {
            const title = document.querySelector("#title");

            if (title && title instanceof HTMLElement) {
                title.style.height = "0px";
            }

            const root = document.querySelector("#root");
            if (root && root instanceof HTMLElement) {
                root.style.height = "calc(100vh - 8px - 8px)";
            }
        }
    }, []);

    return (
        <ConfigProvider
            theme={{
                algorithm: antdTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <ThemeContext.Provider value={{ setTheme, updateBackround, antdTheme }}>{children}</ThemeContext.Provider>
        </ConfigProvider>
    );
};

/**
 * A custom hook for the {@link AntdThemeProvider} component.
 * @returns {ThemeContextPayload} The context payload.
 */
const useAntdTheme = () => React.useContext(ThemeContext);

export { useAntdTheme, AntdThemeProvider, useToken as useAntdToken };
