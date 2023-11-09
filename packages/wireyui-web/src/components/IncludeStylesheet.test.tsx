/* @jsxImportSource .. */

import type { Component } from '@captainpants/wireyui-core';
import { GlobalCss, GlobalCssClass, StyleHooks } from '../styles/index.js';
import { testRender } from '../test/testRender.js';
import { IncludeStylesheet } from './IncludeStylesheet.js';

const example = new GlobalCss({
    id: 'Something',
    content: `
        body { background-color: red; }
    `,
});

it('Global stylesheet added', () => {
    const res = testRender(() => {
        return <IncludeStylesheet stylesheet={example} />;
    });

    expect(document.head.innerHTML).toMatchSnapshot();

    res.dispose();
});

const componentStylesheet = new GlobalCssClass({
    id: 'Component1',
    content: `
        color: blue;
    `,
});

const Component1: Component = (props, init) => {
    const styleHooks = init(StyleHooks);

    return (
        <>
            <IncludeStylesheet stylesheet={componentStylesheet} />
            <div class={styleHooks.getClassName(componentStylesheet)}>
                This is an example
            </div>
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
