/* @jsxImportSource .. */

import { Suspense } from '@serpentis/ptolemy-core';

import { testRender } from '../test/testRender.js';

it('Suspense displays children', () => {
    const res = testRender(() => (
        <Suspense fallback={() => <div>FALLBACK</div>}>
            {() => <div>COMPLETE</div>}
        </Suspense>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
