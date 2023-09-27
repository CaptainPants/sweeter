import { expectDOMMatching } from './test/domDiffer.js';

it('Simple div has text content and title attribute', () => {
    const res = <div title="test">Something</div>;

    if (!(res instanceof Node)) {
        fail('Should be a node');
    }

    expectDOMMatching(res, {
        title: 'test',
        nodeName: 'DIV',
        children: [{ nodeType: Node.TEXT_NODE, textContent: 'Something' }],
    });
});

it('Nested elements appear in output', () => {
    const res = (
        <div title="test">
            <span>1</span>
            <span>2</span>
        </div>
    );

    if (!(res instanceof Node)) {
        fail('Should be a node');
    }

    expectDOMMatching(res, {
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
});

function BasicComponent({ children }: { children: JSX.Element }) {
    return <div>{children}</div>;
}

it('Basic components produce output', () => {
    const res = (
        <div title="test">
            <BasicComponent>1</BasicComponent>
            <BasicComponent>2</BasicComponent>
        </div>
    );

    if (!(res instanceof Node)) {
        fail('Should be a node');
    }

    expectDOMMatching(res, {
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
});

it('Basic component with single children produces correct output', () => {
    const res = (
        <BasicComponent>
            <span>1</span>
        </BasicComponent>
    );

    if (!(res instanceof Node)) {
        fail('Should be a node');
    }

    expectDOMMatching(res, {
        nodeName: 'DIV',
        children: [
            {
                nodeName: 'SPAN',
                children: [{ nodeType: Node.TEXT_NODE, textContent: '1' }],
            },
        ],
    });
});

it('Basic component with multiple children produces correct output', () => {
    const res = (
        <BasicComponent>
            <span>1</span>
            <span>2</span>
        </BasicComponent>
    );

    if (!(res instanceof Node)) {
        fail('Should be a node');
    }

    expectDOMMatching(res, {
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
});
