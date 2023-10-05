import { testRender } from './index.js';
import { expectDOMMatching } from './test/expectDOMMatching.js';

// TODO: these aren't running through a renderer, which might break in future iterations.
// consider a test rendering function that wraps around the JSX calls `testRender(() => <jsx />)`

it('Simple div has text content and title attribute', () => {
    const res = testRender(() => <div title="test">Something</div>);

    expectDOMMatching(res.nodes[0], {
        title: 'test',
        nodeName: 'DIV',
        children: [{ nodeType: Node.TEXT_NODE, textContent: 'Something' }],
    });

    res.dispose();
});

it('Nested elements appear in output', () => {
    const res = testRender(() => (
        <div title="test">
            <span>1</span>
            <span>2</span>
        </div>
    ));

    expectDOMMatching(res.nodes[0], {
        title: 'test',
        nodeName: 'DIV',
        children: [
            {
                nodeName: 'SPAN',
                children: [{ nodeType: Node.TEXT_NODE, textContent: '1' }],
            },
            {
                nodeName: 'SPAN',
                children: [{ nodeType: Node.TEXT_NODE, textContent: '2' }],
            },
        ],
    });

    res.dispose();
});

function BasicComponent({ children }: { children: JSX.Element }) {
    return <div>{children}</div>;
}

it('Basic components produce output', () => {
    const res = testRender(() => (
        <div title="test">
            <BasicComponent>1</BasicComponent>
            <BasicComponent>2</BasicComponent>
        </div>
    ));

    expectDOMMatching(res.nodes[0], {
        title: 'test',
        nodeName: 'DIV',
        children: [
            {
                nodeName: 'DIV',
                children: [{ nodeType: Node.TEXT_NODE, textContent: '1' }],
            },
            {
                nodeName: 'DIV',
                children: [{ nodeType: Node.TEXT_NODE, textContent: '2' }],
            },
        ],
    });

    res.dispose();
});

it('Basic component with single children produces correct output', () => {
    const res = testRender(() => (
        <BasicComponent>
            <span>1</span>
        </BasicComponent>
    ));

    expectDOMMatching(res.nodes[0], {
        nodeName: 'DIV',
        children: [
            {
                nodeName: 'SPAN',
                children: [{ nodeType: Node.TEXT_NODE, textContent: '1' }],
            },
        ],
    });

    res.dispose();
});

it('Basic component with multiple children produces correct output', () => {
    const res = testRender(() => (
        <BasicComponent>
            <span>1</span>
            <span>2</span>
        </BasicComponent>
    ));

    expectDOMMatching(res.nodes[0], {
        nodeName: 'DIV',
        children: [
            {
                nodeName: 'SPAN',
                children: [{ nodeType: Node.TEXT_NODE, textContent: '1' }],
            },
            {
                nodeName: 'SPAN',
                children: [{ nodeType: Node.TEXT_NODE, textContent: '2' }],
            },
        ],
    });

    res.dispose();
});
