import child_process from 'node:child_process';

function wait(timeoutMs: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        function cleanup() {
            signal?.removeEventListener('abort', abortHandler);
            clearTimeout(id);
        }
        const id = setTimeout(() => {
            cleanup();
            resolve(void 0);
        }, timeoutMs);

        function abortHandler() {
            cleanup();
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- This should be an error..
            reject(signal?.reason);
        }
        signal?.addEventListener('abort', abortHandler);
    });
}

function waitForExit(
    childProcess: child_process.ChildProcess,
    abortSignal?: AbortSignal,
): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        // If a process has alreadyed exited, resolve with the exitCode
        if (childProcess.exitCode !== null) {
            resolve(childProcess.exitCode);
            return;
        }

        // Otherwise listen for the close event or for the passed AbortSignal
        function aborted() {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- This should be an error..
            reject(abortSignal?.reason);
        }

        function cleanup() {
            childProcess.off('close', closeHandler);
            abortSignal?.removeEventListener('abort', aborted);
        }

        function closeHandler(code: number | null) {
            cleanup();
            resolve(code ?? 0); // not sure why this is allowed to null
        }

        abortSignal?.addEventListener('abort', aborted);
        childProcess.on('close', closeHandler);
    });
}

export async function gracefullyTerminateProcess(
    childProcess: child_process.ChildProcess,
    signal: NodeJS.Signals,
    abortSignal?: AbortSignal,
): Promise<number> {
    // Any associated streams need to be closed
    childProcess.stdout?.destroy();
    childProcess.stderr?.destroy();
    childProcess.stdin?.destroy();

    const res = childProcess.kill(signal);

    if (!res) {
        console.warn(
            `kill(${childProcess.pid}, ${JSON.stringify(signal)}) returned false`,
        );
    }

    const result = await Promise.any([
        waitForExit(childProcess, abortSignal),
        wait(5000).then(() => {
            throw new Error(
                `Timed out while killing process ${childProcess.pid}.`,
            );
        }),
    ]);

    return result;
}
