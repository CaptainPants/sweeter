import { $mutable, type Component } from '@serpentis/ptolemy-core';
import { debounce } from '@serpentis/ptolemy-utilities';
import {
    type ElementCssClasses,
    type ElementCssStyles,
} from '@serpentis/ptolemy-web';

import { observeSize } from '../internal/observeSize.js';

export interface MeasuredBoxProps {
    children?: JSX.Element | undefined;

    onInitialLayout: (width: number, height: number) => void;
    onLayout: (width: number, height: number) => void;

    class?: ElementCssClasses;
    style?: ElementCssStyles;

    debounceTimeout?: number | undefined;
}

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
        elementSignal.value = element;
    };

    init.trackSignals(
        [elementSignal, debounceTimeout],
        ([element, debounceTimeout]) => {
            if (!element) return;

            let first = true;

            const size = element.getBoundingClientRect();

            onInitialLayout.peek()(size.width, size.height);

            const debouncedCallback = debounce(
                debounceTimeout ?? defaultTimeout,
                (entry: ResizeObserverEntry) => {
                    const { width, height } = entry.contentRect;
                    onLayout.peek()(width, height);
                },
            );
            const stopObserving = observeSize(element, (size) => {
                // Don't debounce the first resize as this is probably
                // when the page is first displayed.
                // In current testing the size is 0x0 when onInitialLayout is called.
                if (first) {
                    first = false;
                    onLayout.peek()(
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
