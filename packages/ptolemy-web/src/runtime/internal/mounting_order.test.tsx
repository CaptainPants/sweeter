/* @jsxImportSource ../.. */

import { type ComponentInit } from '@serpentis/ptolemy-core';
import { $val } from '@serpentis/ptolemy-core';

import { testRender } from '../../test/testRender.js';

interface TestingComponentWithChildrenProps {
    number: number;
    children?: JSX.Element;
    onMount: (num: number) => void;
    onUnMount: (num: number) => void;
}

function TestingComponentWithChildren(
    props: TestingComponentWithChildrenProps,
    init: ComponentInit,
): JSX.Element {
    init.onMount(() => {
        $val(props.onMount)($val(props.number));
    });
    init.onUnMount(() => {
        $val(props.onUnMount)($val(props.number));
    });

    return (
        <div>
            <em>{props.number}</em>
            <div>{props.children}</div>
        </div>
    );
}

it('Mount is called in order', () => {
    const mountOrder: number[] = [];
    const unMountOrder: number[] = [];

    const onMount = (num: number) => {
        mountOrder.push(num);
    };
    const onUnMount = (num: number) => {
        unMountOrder.push(num);
    };

    const res = testRender(() => (
        <TestingComponentWithChildren
            number={1}
            onMount={onMount}
            onUnMount={onUnMount}
        >
            <TestingComponentWithChildren
                number={2}
                onMount={onMount}
                onUnMount={onUnMount}
            >
                <TestingComponentWithChildren
                    number={3}
                    onMount={onMount}
                    onUnMount={onUnMount}
                />
            </TestingComponentWithChildren>
            <TestingComponentWithChildren
                number={4}
                onMount={onMount}
                onUnMount={onUnMount}
            />
        </TestingComponentWithChildren>
    ));

    expect(res.nodes).toMatchSnapshot();

    // Depth first order (child before parent)
    expect(mountOrder).toStrictEqual([3, 2, 4, 1]);

    res.dispose();

    // Depth first order (parent before child)
    expect(unMountOrder).toStrictEqual([1, 4, 2, 3]);
});
