import { PromiseExecutor } from "@nx/devkit";
import { type WatchAndReturnExecutorSchema } from "./schema.js";

import * as child_process from 'node:child_process';

const runExecutor: PromiseExecutor<WatchAndReturnExecutorSchema> = async (
    options,
    context
) => {
    const successPattern: RegExp | null = options.successPattern ? new RegExp(options.successPattern) : null;

    return new Promise((resolve, reject) => {
        console.log("Executor ran for WatchAndReturn", options, context.root);
    
        const child = child_process.spawn(options.command, { shell: true, cwd: context.cwd, stdio: ['inherit', 'pipe', 'inherit'] });

        child.stdout.setEncoding('utf-8');
        const reader = createReader(line => {
            console.warn('OUTPUT ', line)
            if (successPattern) {
                const match = line.match(successPattern);
                if (match) {
                    console.warn('MATCHED');
                }
            }
        });
        child.stdout.on('data', reader.read);

        child.addListener('close', () => {
            reader.close();
            resolve({
                success: true,
            });
        })
        child.unref();
    });
};

function createReader(callback: (line: string) => void) {
    let buffer: string = '';

    return {
        read: (data: string) => {
            console.warn(data);

            let remaining = data;

            for (;;) {
                let beforeFirstLineBreak: string;
                [beforeFirstLineBreak, remaining] = removeFirstLine(remaining);

                buffer += beforeFirstLineBreak;

                if (remaining) {
                    callback(beforeFirstLineBreak);
                    beforeFirstLineBreak = '';
                }
                else {
                    break; // there is nothing left, exit loop
                }
            }
        },
        close: () => {
            if (buffer){
                callback(buffer);
                buffer = '';
            }
        }
    };
}

function removeFirstLine(data: string): [line: string, remainder: string | null] {
    const index = data.indexOf('\n');
    if (index < 0) {
        return [data, null];
    }
    return [data.substring(0, index), data.substring(index + 1)];
}

export default runExecutor;
