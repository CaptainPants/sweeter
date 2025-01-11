/* @jsxImportSource ../. */

import { $mutable } from '@captainpants/sweeter-core';

import { testRender } from '../test/testRender.js';

it('class array with signals', () => {
    const cls1 = $mutable('alpha');
    const cls2 = $mutable('beta');

    const res = testRender(() => <div class={[cls1, cls2, 'gamma']}></div>);

    expect(res.getHTML()).toMatchSnapshot();

    cls2.value = 'delta';

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});

it('class object', () => {
    const on = $mutable(false);

    const res = testRender(() => <div class={[{ alpha: on }, 'beta']}></div>);

    expect(res.getHTML()).toMatchSnapshot();

    on.value = true;

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
