/* @jsxImportSource .. */

import {
    $async,
    $val,
    type Component,
    Suspense,
} from '@captainpants/sweeter-core';
import { testRender } from '../test/testRender.js';

interface Component1Props {
    dataLoadComplete: AbortSignal;
    rendered: AbortController;
}

const Component1: Component<Component1Props> = (props, init) => {
    const rendered = $async(
        (abort) => {
            return new Promise<string>((resolve) => {
                props.dataLoadComplete.addEventListener('abort', () => {
                    resolve('RESOLVED!');
                });
            });
        },
        (asyncInitializerResult) => {
            return <div>RESULT: {$val(asyncInitializerResult)}</div>;
        },
    );

    props.rendered.abort();

    return rendered;
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
