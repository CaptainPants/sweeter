/* @jsxImportSource .. */

import { $foreach, $mutable, For } from '@captainpants/sweeter-core';
import { testRender } from '../test/testRender.js';

it('ForEach basic 1', () => {
    const items = $mutable(['alpha', 'beta', 'gamma']);

    const res = testRender(() => (
        <For each={items}>
            {(item, index) => ['Item ', item, ' at index ', index, ', ']}
        </For>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});

it('$foreach basic 1 - shorthand', () => {
    const items = $mutable(['alpha', 'beta', 'gamma']);

    const res = testRender(() =>
        $foreach(items, (item, index) => [
            'Item ',
            item,
            ' at index ',
            index,
            ', ',
        ]),
    );

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});

it('ForEach append', () => {
    const items = $mutable(['alpha', 'beta', 'gamma']);

    const res = testRender(() => (
        <For each={items}>
            {(item, index) => ['Item ', item, ' at index ', index, ', ']}
        </For>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    items.value = items.value.concat('delta');

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
