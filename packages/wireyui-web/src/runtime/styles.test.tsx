/* @jsxImportSource ../. */

import { $mutable } from '@captainpants/wireyui-core';
import { testRender } from '../test/testRender.js';

it('styles', () => {
    const cls1 = $mutable('alpha');
    const cls2 = $mutable('beta');

    const res = testRender(() => <div class={[cls1, cls2, 'gamma']}></div>);

    expect(res.getHTML()).toMatchSnapshot();

    cls2.value = 'delta';

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
