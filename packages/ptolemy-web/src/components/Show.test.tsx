/* @jsxImportSource .. */

import { $mutable, Show } from '@serpentis/ptolemy-core';

import { createWebRuntime } from '../runtime/createWebRuntime.js';
import { expectDOMMatching } from '../test/internal/expectDOMMatching.js';

it('Show initially displays and then hides content when signal updated', () => {
    const cond = $mutable(true);

    const root = document.createElement('div');

    const runtime = createWebRuntime({
        root: root,
        render: () => <Show if={cond}>{() => <div>CONDITION TRUE</div>}</Show>,
    });

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

    runtime.dispose();
});
