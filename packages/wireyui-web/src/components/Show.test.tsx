import { Show, mutable } from "@captainpants/wireyui-core";
import { expectDOMMatching } from '../test/expectDOMMatching.js';
import { WebRenderer } from '../WebRenderer.js';

it('', () => {
    const cond = mutable(true);

    const renderer = new WebRenderer();

    const root = document.createElement('div');
    renderer.start(root, <Show if={cond}>
        {() => <div>CONDITION TRUE</div>}
    </Show>);

    expectDOMMatching(root.childNodes[0] as HTMLElement, {
        nodeName: 'DIV',
        children: [
            {
                nodeType: Node.TEXT_NODE,
                textContent: 'CONDITION TRUE',
            }
        ]
    });

    cond.value = false;

    expectDOMMatching(root.childNodes[0] as HTMLElement, {
        nodeName: 'DIV',
        children: []
    });
});