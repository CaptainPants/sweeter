import { WebRenderer } from './WebRenderer.js';

function Component() {
    return <div id="test" />;
}

it('Root', () => {
    const root = new WebRenderer();

    root.start(document.getElementById('#id')!, <Component />);
});
