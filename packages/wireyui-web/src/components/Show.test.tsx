/* @jsxImportSource .. */

import { Show, $mutable } from '@captainpants/wireyui-core';
import { expectDOMMatching } from '../test/expectDOMMatching.js';
import { WebRuntime } from '../runtime/WebRuntime.js';

it('Show initially displays and then hides content when signal updated', () => {
    const cond = $mutable(true);

    const runtime = new WebRuntime();

    const root = document.createElement('div');
    runtime.createRoot(root, () => (
        <Show if={cond}>{() => <div>CONDITION TRUE</div>}</Show>
    ));

    expect(root.childNodes.length).toBe(1);
    // JSX.Element signals use a Comment as the start/end marker as they do
    // not participate in layout.
    expectDOMMatching(root.childNodes[0] as HTMLElement, {
        nodeName: 'DIV',
        children: [
            {
                nodeType: Node.TEXT_NODE,
                textContent: 'CONDITION TRUE',
            },
        ],
    });

    cond.value = false;

    // Start and end marker
    expect(root.childNodes.length).toBe(0);
});
