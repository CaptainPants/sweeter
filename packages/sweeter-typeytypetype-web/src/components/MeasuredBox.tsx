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
}>;

export const MeasuredBox: Component<MeasuredBoxProps> = (
    { children, onInitialLayout, onLayout, ...passthrugh },
    init,
) => {
    const elementSignal = $mutable<HTMLDivElement | undefined>(undefined);

    const setElement = (element: HTMLDivElement): void => {
        elementSignal.update(element);
    };

    init.subscribeToChanges(
        [elementSignal],
        ([element]) => {
            if (!element) return;

            let first = true;

            const debouncedCallback = debounce(
                1000,
                (entry: ResizeObserverEntry) => {
                    const { width, height } = entry.contentRect;
                    $peek(onLayout)(width, height);
                },
            );
            const stopObserving = observeSize(element, size => {
                if (first) {
                    first = false;
                    $peek(onInitialLayout)(size.contentRect.width, size.contentRect.height);
                }
                else {
                    debouncedCallback(size);
                }
            });

            return () => {
                stopObserving();
                debouncedCallback.cancel();
            };
        },
        true,
    );

    return (
        <div ref={setElement} {...passthrugh}>
            {children}
        </div>
    );
};
