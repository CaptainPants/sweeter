/* @jsxImportSource ../. */

import {
    assertNeverNullish,
    type TypeMatchAssert,
} from '@captainpants/sweeter-core';
import { jsx } from './jsx.js';
import { testRender } from '../test/testRender.js';

it('basic div creates with props (function syntax)', () => {
    let div: HTMLDivElement | undefined;

    const res = testRender(() => {
        const inner = jsx('div', {
            children: ['test', 'content'],
            class: 'test',
            ref: (ele) => (div = ele),
        });

        // Confirm the result is a div, its nice to make sure that jsx() gives strongly typed results.
        const _typeAssert1: TypeMatchAssert<HTMLDivElement, typeof inner> =
            true;

        return inner;
    });

    assertNeverNullish(div);

    expect(div).toBeInstanceOf(HTMLDivElement);

    expect(div.className).toStrictEqual('test');

    expect(div.childNodes.length).toStrictEqual(2);

    expect(div.childNodes[0]).toBeInstanceOf(Text);
    expect((div.childNodes[0] as Text).textContent).toStrictEqual('test');

    expect(div.childNodes[1]).toBeInstanceOf(Text);
    expect((div.childNodes[1] as Text).textContent).toStrictEqual('content');

    res.dispose();
});

it('basic div creates with props (using jsx syntax)', () => {
    let div: HTMLDivElement | undefined;

    const res = testRender(() => {
        const inner = (
            <div class={'test'} ref={(ele) => (div = ele)}>
                {'test'}
                {'content'}
            </div>
        );

        // jsx always returns the opaque JSX.Element type
        const _typeAssert1: TypeMatchAssert<JSX.Element, typeof inner> = true;

        return inner;
    });

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

    res.dispose();
});
