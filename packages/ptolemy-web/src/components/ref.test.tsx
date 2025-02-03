/* @jsxImportSource .. */

import { $mutable } from '@serpentis/ptolemy-core';

import { testRender } from '../test/testRender.js';

it('Ref assigned (callback)', () => {
    const value = $mutable('test-1');

    let ref: HTMLInputElement | undefined;

    const res = testRender(() => {
        return <input type="text" value={value} ref={(ele) => (ref = ele)} />;
    });

    expect(ref).not.toBeUndefined();

    res.dispose();
});

it('Ref assigned (signal)', () => {
    const value = $mutable('test-1');
    const callbackSignal = $mutable<(ele: HTMLInputElement) => void>((ele) => {
        storedIn.value = ele;
    });
    const storedIn = $mutable<HTMLInputElement>();

    const res = testRender(() => {
        return <input type="text" value={value} ref={callbackSignal} />;
    });

    expect(callbackSignal).not.toBeUndefined();

    res.dispose();
});
