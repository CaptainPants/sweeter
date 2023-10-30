/* @jsxImportSource .. */

import { $mutable } from '@captainpants/wireyui-core';
import { testRender } from '../test/testRender.js';

it('Input value updated', () => {
    const value = $mutable('test-1');

    let ref: HTMLInputElement | null = null;

    const res = testRender(() => {
        return (
            <input type="text" value={value} ref={(value) => (ref = value)} />
        );
    });

    if (!ref) throw new TypeError('ref should not be null');

    res.dispose();
});
