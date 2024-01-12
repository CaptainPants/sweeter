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
        if (element) {
            const { width, height } = element.getBoundingClientRect();
            $peek(onInitialLayout)(width, height);
        }

        elementSignal.update(element);
    };

    init.subscribeToChanges(
        [elementSignal],
        ([element]) => {
            if (!element) return;

            const debouncedCallback = debounce(
                1000,
                (entry: ResizeObserverEntry) => {
                    const { width, height } = entry.contentRect;
                    $peek(onLayout)(width, height);
                },
            );
            const stopObserving = observeSize(element, debouncedCallback);

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
