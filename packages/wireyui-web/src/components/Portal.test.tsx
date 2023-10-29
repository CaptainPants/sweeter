/* @jsxImportSource .. */

import { Portal } from '@captainpants/wireyui-core';
import { testRender } from '../test/testRender.js';

it('Portal element mounts', () => {
    const target = document.createElement('div');

    const { dispose, getHTML } = testRender(() => (
        <Portal target={target}>{() => <div>CONTENT</div>}</Portal>
    ));

    // The contents of our in-tree render should be empty, but will have hook placeholders
    expect(getHTML()).toMatchSnapshot();

    expect(target.outerHTML).toMatchSnapshot();

    dispose();

    // Should have been cleared
    expect(target.outerHTML).toMatchSnapshot();
});
