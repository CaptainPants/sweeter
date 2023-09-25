import { JSXElement } from '@captainpants/wireyui-core';
import { WebRenderer } from './WebRenderer.js';

function Component(): JSXElement {
    return <div id="test" draggable />;
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

it('Root', () => {
    const root = new WebRenderer();

    root.start(document.getElementById('#id')!, <Component />);
});

it('SVG Root', () => {
    const root = new WebRenderer();

    root.start(document.getElementById('#id')!, <SvgComponent />);
});
