/* @jsxImportSource .. */

import type { Component } from '@captainpants/wireyui-core';
import { GlobalCssClass, styles } from '../styles/index.js';
import { testRender } from '../test/testRender.js';
import { IncludeStylesheet } from './IncludeStylesheet.js';

const example = styles.global(
    'Something',
    `
        body { background-color: red; }
    `,
);

it('Global stylesheet added', () => {
    const res = testRender(() => {
        return <IncludeStylesheet stylesheet={example} />;
    });

    expect(document.head.innerHTML).toMatchSnapshot();

    res.dispose();
});

const componentStylesheet = new GlobalCssClass({
    nameBasis: 'Component1',
    content: `
        color: blue;
    `,
});

const Component1: Component = (props, init) => {
    return (
        <>
            <IncludeStylesheet stylesheet={componentStylesheet} />
            <div class={componentStylesheet}>This is an example</div>
        </>
    );
};

it('Global style for component', () => {
    const res = testRender(() => {
        return <Component1 />;
    });

    expect(document.head.innerHTML).toMatchSnapshot();

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});
