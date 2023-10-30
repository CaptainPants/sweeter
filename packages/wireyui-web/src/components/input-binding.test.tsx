/* @jsxImportSource .. */

import { $mutable } from '@captainpants/wireyui-core';
import { testRender } from '../test/testRender.js';

it('Input value updated', () => {
    const value = $mutable('test-1');

    let ref: HTMLInputElement | undefined;

    const res = testRender(() => {
        return <input type="text" value={value} ref={(ele) => (ref = ele)} />;
    });

    if (!ref) {
        throw new Error('Ref not set');
    }

    const event = new InputEvent('input');
    ref.value = 'test-2';
    ref.dispatchEvent(event);

    expect(value.value).toStrictEqual('test-2');

    res.dispose();
});
