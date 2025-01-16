import child_process from 'node:child_process';
import { createPassthrough } from "./createPassthrough.ts";

import { type Project } from "./types.ts";
import chalk from 'chalk';

export interface RunOneArgs {
    project: Project;
    target: string;
    successPatternRegExp: RegExp | null;
    log: (text: string) => void;
    signal: AbortSignal;
}

export interface RunOneCleanupHandle {
    cleanup(): void;
}

export function runOne({ project, target, successPatternRegExp: successPattern, log, signal }: RunOneArgs): Promise<RunOneCleanupHandle> {
    log(chalk.green('== STARTING =='));

    return new Promise<RunOneCleanupHandle>(
        (resolve, reject) => {            
            const child = child_process.spawn(`pnpm run ${target}`, { shell: true, cwd: project.location, stdio: ['inherit', 'pipe', 'inherit'] });

            const abortHandler = () => {
                child.kill('SIGINT');
                unsubscribeFromAbort();
            }
            signal.addEventListener(
                'abort',
                abortHandler
            );
            const unsubscribeFromAbort = () => void signal.removeEventListener('abort', abortHandler);

            function finish(becauseOfSuccess: boolean) {
                unsubscribeFromAbort();

                if (becauseOfSuccess) {
                    log(chalk.green('== SUCCESS!! =='));
                }
                let cleanedUp = false;
                resolve({
                    cleanup: () => {
                        if (cleanedUp) return;

                        log(chalk.red('== TERMINATING!! =='));
                        cleanedUp = true;
                        
                        if (child.kill('SIGINT')) {
                            log('== TERMINATED ==')
                        }
                        else {
                            log('== FAILED TO TERMINATE ==');
                        }
                    }
                });
            }

            const { flush } = createPassthrough(child.stdout, (line, original) => {
                log(original);

                if (successPattern) {
                    // console.error('Testing ', JSON.stringify(line));
                    const match = line.match(successPattern);
                    if (match) {
                        finish(true);
                    }
                }
            });

            child.addListener('close', (code, signal) => {
                unsubscribeFromAbort();
                flush();
                
                if (signal != 'SIGINT' && code !== 0) {
                    reject(`Child process closed with status ${code}`);
                }
                finish(false);
            })
            child.unref();
        }
    );
}