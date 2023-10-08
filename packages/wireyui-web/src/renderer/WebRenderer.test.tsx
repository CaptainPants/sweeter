/* @jsxImportSource ../. */

import type { JSXElement } from '@captainpants/wireyui-core';
import { WebRenderer } from './WebRenderer.js';

function Component(): JSXElement {
    return <div id="test" />;
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
    const root = new WebRenderer();

    root.start(document.createElement('div'), () => <Component />);
});

it("WebRenderer with an SVG component doesn't throw", () => {
    const root = new WebRenderer();

    root.start(document.createElement('div'), () => <SvgComponent />);
});
