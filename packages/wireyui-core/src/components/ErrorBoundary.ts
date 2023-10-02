import { calc, valueOf } from '../index.js';
import type { ComponentInit, Props } from '../types.js';

export interface ErrorBoundaryProps {
    children: () => JSX.Element;
    renderError: (error: unknown) => JSX.Element;
}

export function ErrorBoundary(
    props: Props<ErrorBoundaryProps>,
    init: ComponentInit,
): JSX.Element;
export function ErrorBoundary(
    { renderError, children }: Props<ErrorBoundaryProps>,
    init: ComponentInit,
): JSX.Element {
    const errorBoundaryCalculation = () => {
        try {
            return valueOf(children)();
        } catch (ex) {
            return valueOf(renderError)(ex);
        }
    };
    return calc(errorBoundaryCalculation);
}
