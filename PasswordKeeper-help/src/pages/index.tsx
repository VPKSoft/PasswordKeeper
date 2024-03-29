import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Translate from "@docusaurus/Translate";

import styles from "./index.module.css";

const HomepageHeader = () => {
    return (
        <header className={clsx("hero hero--primary", styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">
                    <Translate id="help.bannerTitle">PasswordKeeper help</Translate>
                </h1>
                <p className="hero__subtitle">
                    <Translate id="help.bannerSubtitle">Secure your login data</Translate>
                </p>
            </div>
        </header>
    );
};

const Home = () => {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout title={`${siteConfig.title}`} description="Description will go into a meta tag in <head />">
            <HomepageHeader />
            <main>
                <HomepageFeatures />
            </main>
        </Layout>
    );
};

export default Home;
