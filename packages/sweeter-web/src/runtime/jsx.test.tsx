/* @jsxImportSource ../. */

import type { TypeMatchAssert } from '@captainpants/sweeter-core';
import { jsx } from './jsx.js';

it('basic div creates with props (function syntax)', () => {
    const div = jsx('div', { children: ['test', 'content'], class: 'test' });

    // Confirm the result is a div, its nice to make sure that jsx() gives strongly typed results.
    const _typeAssert1: TypeMatchAssert<HTMLDivElement, typeof div> = true;

    expect(div).toBeInstanceOf(HTMLDivElement);

    expect(div.className).toStrictEqual('test');

    expect(div.childNodes.length).toStrictEqual(2);

    expect(div.childNodes[0]).toBeInstanceOf(Text);
    expect((div.childNodes[0] as Text).textContent).toStrictEqual('test');

    expect(div.childNodes[1]).toBeInstanceOf(Text);
    expect((div.childNodes[1] as Text).textContent).toStrictEqual('content');
});

it('basic div creates with props (using jsx syntax)', () => {
    const div = (
        <div class={'test'}>
            {'test'}
            {'content'}
        </div>
    );

    // jsx always returns the opaque JSX.Element type
    const _typeAssert1: TypeMatchAssert<JSX.Element, typeof div> = true;

    expect(div).toBeInstanceOf(HTMLDivElement);

    if (!(div instanceof HTMLDivElement)) {
        throw new Error('Should be a div');
    }

    expect(div.className).toStrictEqual('test');

    expect(div.childNodes.length).toStrictEqual(2);

    expect(div.childNodes[0]).toBeInstanceOf(Text);
    expect((div.childNodes[0] as Text).textContent).toStrictEqual('test');

    expect(div.childNodes[1]).toBeInstanceOf(Text);
    expect((div.childNodes[1] as Text).textContent).toStrictEqual('content');
});
