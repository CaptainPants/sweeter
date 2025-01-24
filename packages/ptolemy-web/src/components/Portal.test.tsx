/* @jsxImportSource .. */

import {
    $mutable,
    type ComponentInit,
    Dynamic,
    NoProps,
    Portal,
} from '@serpentis/ptolemy-core';
import { ConsoleLogSink, LoggingBuilder } from '@serpentis/ptolemy-utilities';

import {
    GlobalCssClass,
    GlobalCssStylesheet,
    IncludeStylesheet,
    stylesheet,
} from '../index.js';
import { testRender } from '../test/testRender.js';

afterEach(() => {
    document.getElementsByTagName('html')[0]!.innerHTML = '';

    new LoggingBuilder().addSink(new ConsoleLogSink()).apply();
});

it('Portal element content is added', () => {
    const target = document.createElement('div');
    target.id = 'host1';

    const { dispose, getHTML } = testRender(() => (
        <Portal target={target}>
            <div>CONTENT</div>
        </Portal>
    ));

    // The contents of our in-tree render should be empty, but will have hook placeholders
    expect(getHTML()).toMatchSnapshot();

    expect(target.outerHTML).toMatchSnapshot();

    dispose();

    // Should have been cleared
    expect(target.outerHTML).toMatchSnapshot();
    target.remove();
});

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

    function TestComponent(_props: NoProps, init: ComponentInit) {
        init.onMount(() => {
            mounted = true;

            return () => {
                mounted = false;
            };
        });

        return <></>;
    }

    const target = document.createElement('div');
    target.id = 'host2';
    document.body.append(target);

    const { dispose } = testRender(() => (
        <Dynamic<boolean> value={shouldMount}>
            {(visible) => {
                if (visible) {
                    return (
                        <>
                            MOUNTED
                            <Portal target={target}>
                                <div>MOUNTED</div>
                                <IncludeStylesheet stylesheet={style} />
                            </Portal>
                            <TestComponent />
                        </>
                    );
                } else {
                    return 'NOT MOUNTED';
                }
            }}
        </Dynamic>
    ));

    shouldMount.value = true;
    expect(mounted).toStrictEqual(true);

    expect(document.head.outerHTML).toMatchSnapshot(); //1
    expect(document.body.outerHTML).toMatchSnapshot(); //2

    shouldMount.value = false;
    expect(mounted).toStrictEqual(false);

    // Should have been cleared
    expect(document.head.outerHTML).toMatchSnapshot(); //3
    expect(document.body.outerHTML).toMatchSnapshot(); //4

    shouldMount.value = true;
    expect(mounted).toStrictEqual(true);

    // Everything should be back
    expect(document.head.outerHTML).toMatchSnapshot(); //5
    expect(document.body.outerHTML).toMatchSnapshot(); //6

    dispose();

    // Everything should be cleared
    expect(mounted).toStrictEqual(false);

    expect(document.head.outerHTML).toMatchSnapshot(); //7
    expect(document.body.outerHTML).toMatchSnapshot(); //8

    target.remove();
});

it('Portal elements unmount correctly (css class ref)', () => {
    const shouldMount = $mutable(true);

    const style = new GlobalCssClass({
        className: 'name',
        content: stylesheet`
            div {
                color: red;
            }
        `,
    });

    let mounted = false;

    function TestComponent(_props: NoProps, init: ComponentInit) {
        init.onMount(() => {
            mounted = true;

            return () => {
                mounted = false;
            };
        });

        return <></>;
    }

    const target = document.createElement('div');
    target.id = 'host3';
    document.body.append(target);

    const { dispose } = testRender(() => (
        <Dynamic<boolean> value={shouldMount}>
            {(visible) =>
                visible ? (
                    <>
                        MOUNTED
                        <Portal target={target}>
                            <div class={[style]}>MOUNTED</div>
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

    target.remove();
});
