/* @jsxImportSource .. */

import { Suspense, type AsyncComponent } from '@captainpants/sweeter-core';
import { testRender } from '../test/testRender.js';

interface Component1Props {
    signal1: AbortSignal;
}

const Component1: AsyncComponent<Component1Props, string> = (
    props,
    init,
    asyncInitializerResult,
) => {
    return <div>RESULT: {asyncInitializerResult}</div>;
};

Component1.asyncInitializer = async (props) => {
    return new Promise((resolve) => {
        props.signal1.addEventListener('abort', () => {
            resolve('RESOLVED!');
        });
    });
};

it('example 1', async () => {
    const release = new AbortController();

    const res = testRender(() => (
        <Suspense fallback={() => <div>LOADING...</div>}>
            {() => <Component1 signal1={release.signal} />}
        </Suspense>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    release.abort();

    await new Promise((resolve) => {
        queueMicrotask(() => {
            resolve(void 0);
        });
    });

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
