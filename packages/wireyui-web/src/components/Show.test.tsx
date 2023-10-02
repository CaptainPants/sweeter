import { Show, mutable } from '@captainpants/wireyui-core';
import { expectDOMMatching } from '../test/expectDOMMatching.js';
import { WebRenderer } from '../renderer/WebRenderer.js';

it('', () => {
    const cond = mutable(true);

    const renderer = new WebRenderer();

    const root = document.createElement('div');
    renderer.start(root, () => (
        <Show if={cond}>{() => <div>CONDITION TRUE</div>}</Show>
    ));

    expect(root.childNodes.length).toBe(3);
    // JSX.Element signals use a Comment as the start/end marker as they do
    // not participate in layout.
    expectDOMMatching(root.childNodes[0] as Comment, {
        nodeType: Node.COMMENT_NODE,
    });
    expectDOMMatching(root.childNodes[1] as HTMLElement, {
        nodeName: 'DIV',
        children: [
            {
                nodeType: Node.TEXT_NODE,
                textContent: 'CONDITION TRUE',
            },
        ],
    });
    expectDOMMatching(root.childNodes[2] as Comment, {
        nodeType: Node.COMMENT_NODE,
    });

    cond.value = false;

    // Start and end marker
    expect(root.childNodes.length).toBe(2);
    expectDOMMatching(root.childNodes[0] as Comment, {
        nodeType: Node.COMMENT_NODE,
    });
    expectDOMMatching(root.childNodes[1] as Comment, {
        nodeType: Node.COMMENT_NODE,
    });
});
