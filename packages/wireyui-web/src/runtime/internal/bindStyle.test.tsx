/* @jsxImportSource ../.. */

import { $mutable } from '@captainpants/wireyui-core';
import { testRender } from '../../test/testRender.js';

it('bindStyle', () => {
    const color = $mutable('red');

    const res = testRender(() => <div style={{ color: color }}></div>);

    expect(res.getHTML()).toMatchSnapshot();

    color.value = 'green';

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
