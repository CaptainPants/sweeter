export function waitFor(exit: AbortSignal, timeoutMs: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        const timeoutHandle = setTimeout(() => {
            reject('Timed out');
        }, timeoutMs);

        const start = Date.now();

        exit.addEventListener('abort', () => {
            clearTimeout(timeoutHandle);
            resolve(Date.now() - start);
        });
    });
}
