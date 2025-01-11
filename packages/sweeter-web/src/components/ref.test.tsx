/* @jsxImportSource .. */

import { $mutable } from '@captainpants/sweeter-core';

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
    const ref = $mutable<HTMLInputElement>();

    const res = testRender(() => {
        return <input type="text" value={value} ref={ref} />;
    });

    expect(ref).not.toBeUndefined();

    res.dispose();
});
