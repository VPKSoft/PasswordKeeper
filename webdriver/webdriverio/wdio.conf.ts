import { spawn, spawnSync, execSync } from "node:child_process";
import { cwd, stdin, stdout } from "node:process";
import * as os from "node:os";
import * as path from "node:path";
import { join } from "node:path";

// keep track of the `tauri-driver` child process
let tauriDriver;

const isWin = process.platform === "win32";

export const config = {
    specs: ["./test/specs/**/*.ts"],
    maxInstances: 1,
    hostname: "127.0.0.1",
    port: 4_444,
    path: "/",
    capabilities: [
        {
            maxInstances: 1,
            "tauri:options": {
                application: `../../src-tauri/target/release/PasswordKeeper${isWin ? ".exe" : ""}`,
            },
        },
    ],
    reporters: ["spec"],
    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: 60_000,
    },

    // ensure we are running `tauri-driver` before the session starts so that we can proxy the webdriver requests
    beforeSession: () => (tauriDriver = spawn(path.resolve(os.homedir(), ".cargo", "bin", "tauri-driver"), [], { stdio: [null, process.stdout, process.stderr] })),

    // clean up the `tauri-driver` process we spawned at the start of the session
    afterSession: () => tauriDriver.kill(),
};
