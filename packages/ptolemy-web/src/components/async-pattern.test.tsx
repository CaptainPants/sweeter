/* @jsxImportSource .. */

import {
    $async,
    $val,
    type Component,
    Suspense,
} from '@serpentis/ptolemy-core';

import { testRender } from '../test/testRender.js';

interface Component1Props {
    dataLoadComplete: AbortSignal;
    rendered: AbortController;
}

const Component1: Component<Component1Props> = (props, _init) => {
    return $async(
        (_abort) => {
            return new Promise<string>((resolve) => {
                props.dataLoadComplete.addEventListener('abort', () => {
                    resolve('RESOLVED!');
                });
            });
        },
        (asyncInitializerResult) => {
            props.rendered.abort();
            return <div>RESULT: {$val(asyncInitializerResult)}</div>;
        },
    );
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
