import { PromiseExecutor } from "@nx/devkit";
import { type WatchAndReturnExecutorSchema } from "./schema.js";

import * as child_process from 'node:child_process';
import { stderr, stdout } from "node:process";

const runExecutor: PromiseExecutor<WatchAndReturnExecutorSchema> = async (
    options,
) => {
    return new Promise((resolve, reject) => {
        console.log("Executor ran for WatchAndReturn", options);
    
        const child = child_process.spawn('pnpm.cmd run watch', { });
        child.stderr.on('data', data => {
            stderr.write(data);
        });
        child.stdout.on('data', data => {
            console.warn(data, typeof data, data.constructor.name);
    
            stdout.write(data);
        });
        child.stdout.on('close', () => {
            resolve({
                success: true,
            });
        });
        child.unref();
    });
};

export default runExecutor;
