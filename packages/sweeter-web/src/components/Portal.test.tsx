/* @jsxImportSource .. */

import {
    $mutable,
    type ComponentInit,
    Dynamic,
    Portal,
} from '@captainpants/sweeter-core';
import { testRender } from '../test/testRender.js';
import {
    GlobalCssStylesheet,
    IncludeStylesheet,
    stylesheet,
} from '../index.js';

// it('Portal element content is added', () => {
//     const target = document.createElement('div');

//     const { dispose, getHTML } = testRender(() => (
//         <Portal target={target}>
//             <div>CONTENT</div>
//         </Portal>
//     ));

//     // The contents of our in-tree render should be empty, but will have hook placeholders
//     expect(getHTML()).toMatchSnapshot();

//     expect(target.outerHTML).toMatchSnapshot();

//     dispose();

//     // Should have been cleared
//     expect(target.outerHTML).toMatchSnapshot();
// });

it('Portal elements unmount correctly', () => {
    const shouldMount = $mutable(true);

    const style = new GlobalCssStylesheet({
        id: 'style',
        content: stylesheet`
            div {
                color: red;
            }
        `,
    });

    let mounted = false;

    // eslint-disable-next-line @typescript-eslint/ban-types
    function TestComponent(props: {}, init: ComponentInit) {
        init.onMount(() => {
            mounted = true;

            return () => {
                mounted = false;
            };
        });

        return <></>;
    }

    const target = document.createElement('div');
    target.id = 'host';
    document.body.append(target);

    const { dispose } = testRender(() => (
        <Dynamic<boolean> value={shouldMount}>
            {(visible) =>
                visible ? (
                    <>
                        MOUNTED
                        <Portal target={target}>
                            <div>MOUNTED</div>
                            <IncludeStylesheet stylesheet={style} />
                        </Portal>
                        <TestComponent />
                    </>
                ) : (
                    'NOT MOUNTED'
                )
            }
        </Dynamic>
    ));

    shouldMount.value = true;
    expect(mounted).toStrictEqual(true);

    expect(document.head.outerHTML).toMatchSnapshot();
    expect(document.body.outerHTML).toMatchSnapshot();

    shouldMount.value = false;
    expect(mounted).toStrictEqual(false);

    // Should have been cleared
    expect(document.head.outerHTML).toMatchSnapshot();
    expect(document.body.outerHTML).toMatchSnapshot();

    shouldMount.value = true;
    expect(mounted).toStrictEqual(true);

    // Everything should be back
    expect(document.head.outerHTML).toMatchSnapshot();
    expect(document.body.outerHTML).toMatchSnapshot();

    dispose();

    // Everything should be cleared
    expect(mounted).toStrictEqual(false);

    expect(document.head.outerHTML).toMatchSnapshot();
    expect(document.body.outerHTML).toMatchSnapshot();
});
