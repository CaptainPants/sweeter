import { Root } from "./Root";

function Component() {
    return <div id="test" />;
}

it('Root', () => {
    const root = new Root();

    root.render(document.getElementById('#id')!, <Component />)
});
