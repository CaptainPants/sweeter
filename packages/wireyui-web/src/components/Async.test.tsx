/* @jsxImportSource .. */

import { Async, Suspense } from '@captainpants/wireyui-core';
import { testRender } from '../test/testRender.js';

it('Fallback is shown', () => {
    function neverFinishes(signal: AbortSignal) {
        return new Promise<number>((resolve, reject) => {
            // Never resolves/rejects
        });
    }

    const res = testRender(() => (
        <Suspense fallback={() => <div>FALLBACK</div>}>
            {() => (
                <Async<number> callback={neverFinishes}>
                    {(result) => {
                        return result;
                    }}
                </Async>
            )}
        </Suspense>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});

it('Fallback is shown and then content once loaded', async () => {
    const release = new AbortController();

    function load(signal: AbortSignal) {
        return new Promise<number>((resolve, reject) => {
            release.signal.addEventListener('abort', () => {
                resolve(27);
            });
        });
    }

    const res = testRender(() => (
        <Suspense fallback={() => <div>FALLBACK</div>}>
            {() => (
                <Async<number> callback={load}>
                    {(result) => {
                        return result;
                    }}
                </Async>
            )}
        </Suspense>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    release.abort();

    // Promise.then / await promise runs as a microtask, so lets await on a new microtask for it to have updated
    await new Promise((resolve) => {
        queueMicrotask(() => {
            resolve(void 0);
        });
    });

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
