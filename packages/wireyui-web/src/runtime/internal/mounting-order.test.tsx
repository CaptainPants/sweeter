/* @jsxImportSource ../.. */

import type { ComponentInit, Props } from '@captainpants/wireyui-core';
import { valueOf } from '@captainpants/wireyui-core';
import { testRender } from '../../test/testRender.js';

interface TestingComponentWithChildrenProps {
    number: number;
    children?: JSX.Element;
    onMount: (num: number) => void;
    onUnMount: (num: number) => void;
}

function TestingComponentWithChildren(
    props: Props<TestingComponentWithChildrenProps>,
    init: ComponentInit,
): JSX.Element {
    init.onMount(() => {
        valueOf(props.onMount)(valueOf(props.number));
    });
    init.onUnMount(() => {
        valueOf(props.onUnMount)(valueOf(props.number));
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
    expect(mountOrder).toStrictEqual([4, 3, 2, 1]);

    res.dispose();

    // Depth first order (parent before child)
    expect(unMountOrder).toStrictEqual([1, 2, 3, 4]);
});
