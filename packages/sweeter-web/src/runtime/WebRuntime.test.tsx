/* @jsxImportSource ../. */

import { type JSXElement } from '@captainpants/sweeter-core';
import { WebRuntime } from './WebRuntime.js';

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
    const root = new WebRuntime();

    root.createRoot(document.createElement('div'), () => <Component />);
});

it("WebRenderer with an SVG component doesn't throw", () => {
    const root = new WebRuntime();

    root.createRoot(document.createElement('div'), () => <SvgComponent />);
});