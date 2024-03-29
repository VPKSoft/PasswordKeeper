import React from "react";
import clsx from "clsx";
import Translate, { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import app_icon from "@site/static/img/app-icon.svg";
import encrypt_image from "@site/static/img/encryption-data-svgrepo-com.svg";
import tauri_glyph from "@site/static/img/TAURI_Glyph_Color.svg";
import styles from "./styles.module.css";

type FeatureItem = {
    title: string;
    Svg: React.ComponentType<React.ComponentProps<"svg">>;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: translate({ message: "Open source and easy to use", id: "help.openEasyTitle" }),
        Svg: app_icon,
        description: (
            <Translate //
                id="help.openEasyText"
                values={{
                    mitLink: (
                        <Link to={translate({ message: "https://en.wikipedia.org/wiki/MIT_License", id: "help.mitLicense.linkLocation" })}>
                            <Translate //
                                id="help.mitLicense.linkText"
                            >
                                MIT
                            </Translate>
                        </Link>
                    ),
                }}
            >
                {"The simple UX and only the necessary features makes the software easy to use. The {mitLink} license keeps the source open and available for auditing, modification and improvements."}
            </Translate>
        ),
    },
    {
        title: translate({ message: "Strong encryption", id: "help.strongEncryptionTitle" }),
        Svg: encrypt_image,
        description: (
            <Translate //
                id="help.strongEncryptionText"
                values={{
                    aesGcmSivLink: (
                        <Link to={translate({ message: "https://en.wikipedia.org/wiki/AES-GCM-SIV", id: "help.aesGcmSiv.linkLocation" })}>
                            <Translate //
                                id="help.aesGcmSiv.linkText"
                            >
                                AES-GCM-SIV
                            </Translate>
                        </Link>
                    ),
                    argon2Link: (
                        <Link to={translate({ message: "https://en.wikipedia.org/wiki/Argon2", id: "help.argon2.linkLocation" })}>
                            <Translate //
                                id="help.argon2.linkText"
                            >
                                Argon2
                            </Translate>
                        </Link>
                    ),
                }}
            >
                {"The encryption algorithm used is {aesGcmSivLink} with {argon2Link} / Argon2id key derivation function. The PasswordKeeper does not use cloud - only files within the OS file system."}
            </Translate>
        ),
    },
    {
        title: translate({ message: "Multi-platform", id: "help.multiPlatformTitle" }),
        Svg: tauri_glyph,
        description: (
            <Translate //
                id="help.multiPlatformText"
                values={{
                    tauriAppLink: (
                        <Link to="https://tauri.app">
                            <Translate //
                                id="help.tauriApp.linkText"
                            >
                                Tauri Application Framework
                            </Translate>
                        </Link>
                    ),
                }}
            >
                {"The {tauriAppLink} allows the code base to be multi-platform for Windows, Linux and macOS."}
            </Translate>
        ),
    },
];

const Feature = ({ title, Svg, description }: FeatureItem) => {
    return (
        <div className={clsx("col col--4")}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className="text--center padding-horiz--md">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
};

const HomepageFeatures = () => {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomepageFeatures;
