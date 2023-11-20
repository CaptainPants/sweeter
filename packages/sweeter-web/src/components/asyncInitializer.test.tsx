/* @jsxImportSource .. */

import { Suspense, type AsyncComponent } from "@captainpants/sweeter-core";
import { testRender } from "../test/testRender.js";

interface Component1Props {
    signal1: AbortSignal;
}

const Component1: AsyncComponent<string, Component1Props> = (props, init, asyncInitializerResult) => {
    return <div>RESULT: {asyncInitializerResult}</div>
}

Component1.asyncInitializer = async (props, init, signal) => {
    return new Promise(
        (resolve, reject) => {
            props.signal1.addEventListener('abort', () => {
                resolve('RESOLVED!');
            })
        }
    );
};


it('example 1', async() => {
    const abort = new AbortController();

    const res = testRender(
        () => <Suspense fallback={() => <div>LOADING...</div>}>{
            () => <Component1 signal1={abort.signal} />
        }</Suspense>
    );

    expect(res.getHTML()).toMatchSnapshot();

    abort.abort();

    await new Promise(resolve => queueMicrotask(() => resolve(void 0)));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});