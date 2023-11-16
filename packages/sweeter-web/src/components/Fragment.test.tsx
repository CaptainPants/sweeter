/* @jsxImportSource .. */

import { testRender } from '../test/testRender.js';

it('Fragment works single', () => {
    const res = testRender(() => (
        <>
            <div>test</div>
        </>
    ));

    expect(res.getHTML()).toStrictEqual('<div>test</div>');

    res.dispose();
});

it('Fragment works single (array)', () => {
    const res = testRender(() => <>{[<div>test</div>]}</>);

    expect(res.getHTML()).toStrictEqual('<div>test</div>');

    res.dispose();
});

it('Fragment works multiple', () => {
    const res = testRender(() => <>{['a', <div>test</div>, 'b']}</>);

    expect(res.getHTML()).toStrictEqual('a<div>test</div>b');

    res.dispose();
});
