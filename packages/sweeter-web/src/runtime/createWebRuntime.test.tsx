/* @jsxImportSource ../. */

import { type JSXElement } from '@captainpants/sweeter-core';

import { createWebRuntime } from './index.js';

function Component(): JSXElement {
    return (
        <input
            onclick={(evt) => {
                evt.preventDefault();
            }}
            id="id"
        />
    );
}

function SvgComponent(): JSXElement {
    return (
        <svg:svg
            id="test"
            onclick={(evt) => {
                evt.preventDefault();
            }}
        />
    );
}

it("WebRenderer with an HTML component doesn't throw", () => {
    const root = createWebRuntime({
        root: document.createElement('div'),
        render: () => <Component />,
    });

    root.dispose();
});

it("WebRenderer with an SVG component doesn't throw", () => {
    const root = createWebRuntime({
        root: document.createElement('div'),
        render: () => <SvgComponent />,
    });

    root.dispose();
});
