import child_process from 'node:child_process';
import { createPassthrough } from "./createPassthrough.ts";

import { type Project } from "./types.ts";
import chalk from 'chalk';
import { gracefullyTerminateProcess } from './gracefullyTerminateProcess.ts';

export interface RunOneArgs {
    project: Project;
    target: string;
    successPatternRegExp: RegExp | null;
    log: (text: string) => void;
    header: (text: string) => void;
    signal: AbortSignal;
}

export interface RunOneCleanupHandle {
    cleanup(): Promise<void>;
}

export function runOne({ project, target, successPatternRegExp: successPattern, log, header, signal }: RunOneArgs): Promise<RunOneCleanupHandle> {
    return new Promise<RunOneCleanupHandle>(
        (resolve, reject) => {        
            header('STARTING')

            const child = child_process.spawn(`pnpm run ${target}`, { shell: true, cwd: project.location, stdio: ['inherit', 'pipe', 'inherit'] });

            const abortHandler = () => {
                unsubscribeFromAbort();
                child.kill('SIGINT');
            }
            signal.addEventListener(
                'abort',
                abortHandler
            );
            const unsubscribeFromAbort = () => void signal.removeEventListener('abort', abortHandler);

            function finishedStartup(becauseOfSuccess: boolean) {
                unsubscribeFromAbort();

                if (becauseOfSuccess) {
                    header('SUCCESS!!');
                }
                
                resolve({
                    cleanup: async () => {
                        header('TERMINATING');
                        await gracefullyTerminateProcess(child, 'SIGTERM');
                        header('TERMINATED');
                    }
                });
            }

            const { flush } = createPassthrough(child.stdout, (line, original) => {
                log(original);

                if (successPattern) {
                    // console.error('Testing ', JSON.stringify(line));
                    const match = line.match(successPattern);
                    if (match) {
                        finishedStartup(true);
                    }
                }
            });

            child.addListener('close', (code, signal) => {
                unsubscribeFromAbort();
                flush();
                
                if (signal != 'SIGINT' && code !== 0) {
                    reject(`Child process closed with status ${code}`);
                }
                finishedStartup(false);
            })
        }
    );
}