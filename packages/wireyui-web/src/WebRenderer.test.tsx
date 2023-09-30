import { JSXElement } from '@captainpants/wireyui-core';
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

it('Root', () => {
    const root = new WebRenderer();

    root.start(document.createElement('div'), () => <Component />);
});

it('SVG Root', () => {
    const root = new WebRenderer();

    root.start(document.createElement('div'), () => <SvgComponent />);
});
