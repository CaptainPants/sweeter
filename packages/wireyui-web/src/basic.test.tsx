import { expectDOMMatching } from './test/domDiffer.js';

it('Simple div has text content and title attribute', () => {
    const res = <div title="test">Something</div>;

    if (!(res instanceof Node)) {
        fail('Should be a node');
    }

    expectDOMMatching(res, { title: 'test', nodeName: 'DIV', children: [{ nodeType: Node.TEXT_NODE, textContent: 'Something' }] });
});

it('Nested elements appear in output', () => {
    const res = <div title="test">
        <span>1</span>
        <span>2</span>
    </div>;

    if (!(res instanceof Node)) {
        fail('Should be a node');
    }

    expectDOMMatching(res, { title: 'test', nodeName: 'DIV', children: [
        { nodeName: 'SPAN', children: [{ nodeType: Node.TEXT_NODE, textContent: '1' }] },
        { nodeName: 'SPAN', children: [{ nodeType: Node.TEXT_NODE, textContent: '2' }] }
    ] });
});