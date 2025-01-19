import child_process, { type ChildProcessByStdio } from 'node:child_process';
import { Readable } from 'node:stream';

import { createPassthrough } from './createPassthrough.ts';
import { gracefullyTerminateProcess } from './gracefullyTerminateProcess.ts';
import { type Project } from './types.ts';

export interface RunOneArgs {
    project: Project;
    target: string;
    successPatternRegExp: RegExp | null;
    log: (text: string) => void;
    header: (text: string) => void;
    passthrough: (text: string) => void;
    signal: AbortSignal;
}

export interface RunOneResult {
    outcome: 'success' | 'failed' | 'aborted';
    error?: unknown;
    cleanup?: () => Promise<void>;
}

export function runOne({
    project,
    target,
    successPatternRegExp,
    log,
    header,
    passthrough,
    signal,
}: RunOneArgs): Promise<RunOneResult> {
    return new Promise<RunOneResult>((resolve) => {
        let child: ChildProcessByStdio<null, Readable, null> | undefined;

        let terminating = false;

        async function terminate() {
            if (!child) {
                return;
            }

            if (child.exitCode !== null) {
                header('ALREADY TERMINATED');
                return;
            }

            terminating = true;
            header('TERMINATING');
            await gracefullyTerminateProcess(child, 'SIGTERM');
            header('TERMINATED');
        }

        const abortHandler = () => {
            unsubscribeFromAbort();
            resolve({
                outcome: 'aborted',
                cleanup: terminate,
            });
        };

        signal.addEventListener('abort', abortHandler);
        function unsubscribeFromAbort() {
            void signal.removeEventListener('abort', abortHandler);
        }

        try {
            header('STARTING');
            log('successPattern: ' + successPatternRegExp);

            child = child_process.spawn(`pnpm run ${target}`, {
                shell: true,
                cwd: project.location,
                stdio: ['ignore', 'pipe', 'inherit'],
            });

            const { flush } = createPassthrough(
                child.stdout,
                (line, original) => {
                    passthrough(original);

                    if (successPatternRegExp) {
                        const match = line.match(successPatternRegExp);
                        if (match) {
                            header('SUCCESS!!');

                            resolve({
                                outcome: 'success',
                                cleanup: terminate,
                            });
                        }
                    }
                },
            );

            child.addListener('close', (code, signal) => {
                // Ignore the event if we caused it while terminating
                if (terminating) {
                    return;
                }

                flush();

                header('CLOSED');

                // Note that this does nothing if already resolved
                // We don't need to clean up as the process is closed
                resolve({
                    outcome: 'aborted',
                });
            });
        } catch (err) {
            resolve({
                outcome: 'failed',
                error: err,
            });
        }
    });
}
