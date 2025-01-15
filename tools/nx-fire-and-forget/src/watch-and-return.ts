import { PromiseExecutor } from "@nx/devkit";
import { type WatchAndReturnExecutorSchema } from "./schema.js";

import * as child_process from 'node:child_process';
import * as path from "node:path";
import { stdout } from "node:process";
import { Readable } from "node:stream"

type StripAnsi = typeof import('strip-ansi').default
type StripAnsiModule = { default: StripAnsi };

/**
 * https://gist.github.com/passbyval/b85f79381816c197c5c651b7c0b00d5e
 * This is some hot garbage https://github.com/nrwl/nx/issues/15682
 * @param moduleName 
 * @returns 
 */
async function loadESMModule<ModuleType>(moduleName: string): Promise<ModuleType> {
    const doImport = new Function('return import(' + JSON.stringify(moduleName) + ')') as unknown as () => Promise<ModuleType>;
    return await doImport();
}

const runExecutor: PromiseExecutor<WatchAndReturnExecutorSchema> = async (
    options,
    context
) => {
    const successPattern: RegExp | null = options.successPattern ? new RegExp(options.successPattern) : null;

    const stripAnsi = (await loadESMModule<{ default: StripAnsi }>('strip-ansi')).default;

    const promise = new Promise<{ success: boolean }>((resolve) => {
        const projectName = context.projectName;

        const cwd = path.join(context.root, context.projectsConfigurations.projects[projectName].root);

        console.log("Executor ran for WatchAndReturn", options, cwd);

        const child = child_process.spawn(options.command, { shell: true, cwd: cwd, stdio: ['inherit', 'pipe', 'inherit'] });

        function closeStdoutAndResolve() {
            // Testing if this releases the parent process
            console.error('Closing stdout pipe with child')
            child.stdout.unpipe();
            child.stdout.destroy();

            resolve({
                success: true
            });
        }

        const { flush } = createPassthrough(child.stdout, stdout, line => {
            if (successPattern) {
                // console.error('Testing ', JSON.stringify(line));
                const match = line.match(successPattern);
                if (match) {
                    console.error('MATCHED SUCCESS SEQUENCE! Resolving..');
                    
                    closeStdoutAndResolve();
                }
            }
        }, stripAnsi);

        child.addListener('close', () => {
            flush();
            closeStdoutAndResolve();
        })
        child.unref();
    });

    const res = await promise;

    console.error('FINISHED');

    return res;
};

function createPassthrough(source: Readable, target: NodeJS.WriteStream, callback: (line: string) => void, stripAnsi: StripAnsi) {
    let buffer: string | null = '';

    function invokeCallback(line: string) {
        // Write to target the unmodified data
        target.write(line);
        
        const stripped = stripAnsi(line);
        callback(stripped);
    }

    function listener(data: string) {
        let remaining = data;

        for (; ;) {
            let beforeFirstLineBreak: string;
            [beforeFirstLineBreak, remaining] = removeFirstLine(remaining);

            buffer = (buffer ?? '') + beforeFirstLineBreak;

            if (remaining !== null) {
                invokeCallback(beforeFirstLineBreak);
                beforeFirstLineBreak = '';
            }
            else {
                break; // there is nothing left, exit loop
            }
        }
    };

    source.setEncoding('utf-8');
    source.addListener('data', listener);

    function flush() {
        if (buffer !== null) {
            invokeCallback(buffer);
            buffer = null;
        }
    }

    return { flush: flush };
}

function removeFirstLine(data: string): [line: string, remainder: string | null] {
    const index = data.indexOf('\n');
    if (index < 0) {
        return [data, null];
    }
    return [data.substring(0, index), data.substring(index + 1)];
}

export default runExecutor;
