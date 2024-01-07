/* @jsxImportSource .. */

import { $mutable, type Component } from "@captainpants/sweeter-core";
import { type ElementCssStyles, type ElementCssClasses } from "../IntrinsicAttributes.js";

export interface MeasuredBoxProps {
    children?: JSX.Element | undefined;

    onInitialLayout: (width: number, height: number) => void;
    onLayout: (width: number, height: number) => void;

    class?: ElementCssClasses;
    style?: ElementCssStyles;
}

export const MeasuredBox: Component<MeasuredBoxProps> = ({ children, onInitialLayout, onLayout, ...passthrugh }, init) => {
    const elementSignal = $mutable<HTMLDivElement | undefined>(undefined);

    const elementRef = (element: HTMLDivElement): void => {
        if (element) {
            const { width, height } = element.getBoundingClientRect();
            onInitialLayout(width, height);
        }

        // Consider assigning a ref passed in from props
        elementSignal.update(element);
    };

    const callback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
        for (const entry of entries) {
            const { width, height } = entry.contentRect;
            onLayout(width, height);
        }
    };

    init.onMount(
        () => {
            // Create a ResizeObserver
            // TODO: we can probably combine these together nicely so we don't have multiple ResizeObserver instances
            // similar to how @react-hook/resize-observer works internally
            const resizeObserver = new ResizeObserver(callback);
            resizeObserver.observe(elementSignal.value!);

            return () => {
                resizeObserver.disconnect();
            }
        }
    );

    return <div ref={elementRef} {...passthrugh}>{children}</div>;
}