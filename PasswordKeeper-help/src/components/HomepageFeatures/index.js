import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const FeatureList = [
    {
        title: "Open and easy to use",
        Svg: require("@site/static/img/app-icon.svg").default,
        description: (
            <>
                The simple UX and only the necessary features makes the software easy to use. The <a href="https://en.wikipedia.org/wiki/MIT_License">MIT</a> license keeps the source open and
                available for auditing, modification and improvements.
            </>
        ),
    },
    {
        title: "Strong encryption",
        Svg: require("@site/static/img/encryption-data-svgrepo-com.svg").default,
        description: (
            <>
                The encryption algorithm used is <a href="https://en.wikipedia.org/wiki/AES-GCM-SIV">AES-GCM-SIV</a> with <a href="https://en.wikipedia.org/wiki/Argon2">Argon2</a> / Argon2id key
                derivation function. The PasswordKeeper does not use cloud - only files within the OS file system.
            </>
        ),
    },
    {
        title: "Cross-platform",
        Svg: require("@site/static/img/gears-gear-svgrepo-com.svg").default,
        description: (
            <>
                The <a href="https://tauri.app">Tauri Application Framework</a> allows the code base to be cross-platform for Windows, Linux and macOS.
            </>
        ),
    },
];

const Feature = ({ Svg, title, description }) => {
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
