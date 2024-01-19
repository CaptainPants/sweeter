import {
    $mutable,
    type PropertiesMightBeSignals,
    type Component,
    $peek,
} from '@captainpants/sweeter-core';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@captainpants/sweeter-web';
import { debounce } from '@captainpants/sweeter-utilities';
import { observeSize } from '../internal/observeSize.js';

export type MeasuredBoxProps = PropertiesMightBeSignals<{
    children?: JSX.Element | undefined;

    onInitialLayout: (width: number, height: number) => void;
    onLayout: (width: number, height: number) => void;

    class?: ElementCssClasses;
    style?: ElementCssStyles;

    debounceTimeout?: number | undefined;
}>;

const defaultTimeout = 250;

export const MeasuredBox: Component<MeasuredBoxProps> = (
    {
        children,
        onInitialLayout,
        onLayout,
        debounceTimeout = defaultTimeout,
        ...passthrugh
    },
    init,
) => {
    const elementSignal = $mutable<HTMLDivElement | undefined>(undefined);

    const setElement = (element: HTMLDivElement): void => {
        elementSignal.update(element);
    };

    init.trackSignals(
        [elementSignal, debounceTimeout],
        ([element, debounceTimeout]) => {
            if (!element) return;

            let first = true;

            const size = element.getBoundingClientRect();

            $peek(onInitialLayout)(size.width, size.height);

            const debouncedCallback = debounce(
                debounceTimeout ?? defaultTimeout,
                (entry: ResizeObserverEntry) => {
                    const { width, height } = entry.contentRect;
                    $peek(onLayout)(width, height);
                },
            );
            const stopObserving = observeSize(element, (size) => {
                // Don't debounce the first resize as this is probably
                // when the page is first displayed.
                // In current testing the size is 0x0 when onInitialLayout is called.
                if (first) {
                    first = false;
                    $peek(onLayout)(
                        size.contentRect.width,
                        size.contentRect.height,
                    );
                } else {
                    debouncedCallback(size);
                }
            });

            return () => {
                stopObserving();
                debouncedCallback.cancel();
            };
        },
    );

    return (
        <div ref={setElement} {...passthrugh}>
            {children}
        </div>
    );
};
