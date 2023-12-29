/* @jsxImportSource ../.. */

import { $mutable } from '@captainpants/sweeter-core';
import { testRender } from '../../test/testRender.js';
import { type ThreeValueBoolean } from '../../indeterminate.js';

it('input type="text"', () => {
    const state = $mutable<string>('original-0');

    const res = testRender(() => <input type="text" value={state} />);

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});

it('input type="checkbox"', () => {
    const state = $mutable<ThreeValueBoolean>(false);

    const res = testRender(() => <input type="checkbox" checked={state} />);

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});

it('textarea', () => {
    const state = $mutable<string>('original-0');

    const res = testRender(() => <textarea value={state} />);

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
