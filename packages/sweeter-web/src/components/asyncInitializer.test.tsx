/* @jsxImportSource .. */

import { Suspense, type AsyncComponent } from '@captainpants/sweeter-core';
import { testRender } from '../test/testRender.js';

interface Component1Props {
    dataLoadComplete: AbortSignal;
    rendered: AbortController;
}

const Component1: AsyncComponent<Component1Props, string> = (
    props,
    init,
    asyncInitializerResult,
) => {
    props.rendered.abort();
    return <div>RESULT: {asyncInitializerResult}</div>;
};

Component1.asyncInitializer = async (props) => {
    return new Promise((resolve) => {
        props.dataLoadComplete.addEventListener('abort', () => {
            resolve('RESOLVED!');
        });
    });
};

it('example 1', async () => {
    const release = new AbortController();
    const rendered = new AbortController();

    const res = testRender(() => (
        <Suspense fallback={() => <div>LOADING...</div>}>
            {() => (
                <Component1
                    dataLoadComplete={release.signal}
                    rendered={rendered}
                />
            )}
        </Suspense>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    release.abort();

    await new Promise((resolve) => {
        rendered.signal.addEventListener('abort', () => {
            resolve(void 0);
        });
    });

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
