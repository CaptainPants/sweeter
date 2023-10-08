import type { ComponentInit, Props } from '@captainpants/wireyui-core';
import { valueOf } from '@captainpants/wireyui-core';
import { testRender } from '../../index.js';

interface TestingComponentProps {
    number: number;
    children?: JSX.Element;
    onMount: (num: number) => void;
    onUnMount: (num: number) => void;
}

function TestingComponent(
    props: Props<TestingComponentProps>,
    init: ComponentInit,
): JSX.Element {
    init.onMount(() => {
        valueOf(props.onMount)(valueOf(props.number));
    });
    init.onUnMount(() => {
        valueOf(props.onMount)(valueOf(props.number));
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
        <TestingComponent number={1} onMount={onMount} onUnMount={onUnMount}>
            <TestingComponent
                number={2}
                onMount={onMount}
                onUnMount={onUnMount}
            >
                <TestingComponent
                    number={3}
                    onMount={onMount}
                    onUnMount={onUnMount}
                />
            </TestingComponent>
            <TestingComponent
                number={4}
                onMount={onMount}
                onUnMount={onUnMount}
            />
        </TestingComponent>
    ));

    expect(res.nodes).toMatchSnapshot();

    // Depth first order (child before parent)
    //expect(mountOrder).toStrictEqual([3, 2, 4, 1]);
    // Depth first order (parent before child)
    expect(unMountOrder).toStrictEqual([1, 2, 3, 4]);
});
