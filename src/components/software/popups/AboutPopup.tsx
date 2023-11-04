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
import { Button, Popup, ScrollView } from "devextreme-react";
import classNames from "classnames";
import { getName, getVersion } from "@tauri-apps/api/app";
import { styled } from "styled-components";
import { open } from "@tauri-apps/api/shell";
import { useLocalize } from "../../../i18n";
import { CommonProps } from "../../Types";
import { GithubLogo, LogoImage } from "../../../utilities/app/Images";
import { useTauriUpdater } from "../../../hooks/UseTauriUpdater";

/**
 * The props for the {@link AboutPopup} component.
 */
type AboutPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** Occurs when the popup has been closed. */
    onClose: () => void;
    /** A  text color for highlighted text. */
    textColor: string;
} & CommonProps;

const AboutPopup = ({
    className, //
    visible,
    onClose,
}: AboutPopupProps) => {
    const lc = useLocalize("common");
    const ud = useLocalize("updates");

    const [appVersion, setAppVersion] = React.useState("");
    const [appName, setAppName] = React.useState("");

    const [shouldUpdate, manifest, reCheck, update] = useTauriUpdater(false);

    // Get the application name and current version.
    React.useEffect(() => {
        const versionPromise = getVersion();
        const appNamePromise = getName();
        void Promise.all([versionPromise, appNamePromise]).then(([v, n]) => {
            setAppName(n);
            setAppVersion(v);
        });
    }, []);

    // Raise the onClose if the popup is closed via the "X" button.
    const onHiding = React.useCallback(() => {
        if (visible) {
            onClose();
        }
    }, [onClose, visible]);

    // Open the www.vpksoft.net URL when the corresponding component is clicked.
    const openVPKSoftUrl = React.useCallback(() => {
        void open("https://www.vpksoft.net");
    }, []);

    // Open the github.com URL when the corresponding component is clicked.
    const openGitHubUrl = React.useCallback(() => {
        void open("https://github.com/VPKSoft/PasswordKeeper");
    }, []);

    // Open the latest release from the github.com.
    const manualDownloadClick = React.useCallback(() => {
        void open("https://github.com/VPKSoft/PasswordKeeper/releases/latest");
    }, []);

    return (
        <Popup //
            title={lc("about")}
            showCloseButton={true}
            visible={visible}
            dragEnabled={true}
            resizeEnabled={true}
            height={500}
            width={700}
            showTitle={true}
            onHiding={onHiding}
        >
            <div className={classNames(AboutPopup.name, className)}>
                <div className="Popup-versionText">{`${appName}, ${lc("copyright")} © 2023 VPKSoft, v.${appVersion}`}</div>
                <div className="Popup-licenseText">{lc("license")}</div>
                <ScrollView className="Popup-licenseView">
                    <div className="Popup-licenseContent">
                        {`MIT License

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
SOFTWARE."
                `}
                    </div>
                </ScrollView>
                <div className="LogoImages">
                    <img src={LogoImage} className="LogoImage" onClick={openVPKSoftUrl} />

                    <img src={GithubLogo} className="LogoImage" onClick={openGitHubUrl} />
                </div>
                <div
                    className="Popup-UpdateNotify" //
                >
                    {shouldUpdate ? (
                        <div className={classNames("Popup-UpdateNotify-text", "Popup-UpdateNotify-text-updates")}>{ud("newVersionAvailable")}</div>
                    ) : (
                        <div className="Popup-UpdateNotify-text">{ud("versionUpToDate")}</div>
                    )}

                    <div className="Popup-UpdateNotify-text">{`v.${manifest?.version ?? appVersion}`}</div>
                    <div>
                        <Button className="Popup-UpdateNotify-button" icon="refresh" hint={ud("buttonRefresh")} onClick={reCheck}></Button>
                        <Button className="Popup-UpdateNotify-button" icon="download" hint={ud("updateButton")} onClick={update} disabled={!shouldUpdate}></Button>
                        <Button className="Popup-UpdateNotify-button" text={ud("manualDownload")} onClick={manualDownloadClick} />
                    </div>
                </div>
                <div className="Popup-ButtonRow">
                    <Button //
                        text={lc("Ok")}
                        onClick={onClose}
                    />
                </div>
            </div>
        </Popup>
    );
};

const StyledAboutPopup = styled(AboutPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
    .Popup-versionText {
        font-weight: bolder;
        margin-bottom: 10px;
    }
    .Popup-licenseText {
        font-weight: bolder;
        margin-bottom: 10px;
    }
    .Popup-licenseView {
        height: 100%;
        font-family: monospace;
    }
    .Popup-licenseContent {
        white-space: pre-wrap;
    }
    .Popup-UpdateNotify {
        justify-content: space-between;
        display: flex;
        width: 100%;
        flex-direction: row;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .Popup-UpdateNotify-text {
        align-content: center;
        display: flex;
        flex-wrap: wrap;
        margin-right: 10px;
    }
    .Popup-UpdateNotify-button {
        margin-right: 4px;
    }
    .Popup-UpdateNotify-text-updates {
        color: ${p => p.textColor};
    }
    .Popup-ButtonRow {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: flex-end;
    }
    .LogoImages {
        display: flex;
        flex-direction: row;
        height: 100px;
        justify-content: space-evenly;
    }
    .LogoImage {
        height: 90%;
        // margin-left: 25%;
        margin-top: 10px;
        cursor: pointer;
    }
`;

export { StyledAboutPopup };
