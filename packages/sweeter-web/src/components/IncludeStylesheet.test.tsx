/* @jsxImportSource .. */

import type { Component } from '@captainpants/sweeter-core';
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

const component1Stylesheet = new GlobalCssClass({
    nameBasis: 'Component1',
    content: `
        color: blue;
    `,
});

const Component1: Component = (props, init) => {
    return (
        <>
            <IncludeStylesheet stylesheet={component1Stylesheet} />
            <div class={component1Stylesheet}>This is an example</div>
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

const component2Stylesheet = new GlobalCssClass({
    nameBasis: 'Component2',
    content: `
        color: blue;

        .inner {
            background-color: green;
        }
    `,
});

const Component2: Component = (props, init) => {
    return (
        <>
            <IncludeStylesheet stylesheet={component2Stylesheet} />
            <div class={component2Stylesheet}>
                This is an example
                <div class="inner" />
            </div>
        </>
    );
};

it('Global style for component with nested', () => {
    const res = testRender(() => {
        return <Component2 />;
    });

    expect(document.head.innerHTML).toMatchSnapshot();

    expect(res.getHTML()).toMatchSnapshot();

    res.dispose();
});