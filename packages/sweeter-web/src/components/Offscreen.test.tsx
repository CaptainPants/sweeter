/* @jsxImportSource .. */

import { Offscreen } from '@captainpants/sweeter-core';
import { testRender } from '../test/testRender.js';

it('Matches snapshot', () => {
    const res = testRender(() => (
        <Offscreen>
            <div>TEST CONTENT</div>
        </Offscreen>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
