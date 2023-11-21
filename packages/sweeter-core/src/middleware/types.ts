import { type ComponentOrIntrinsicElementTypeConstraint } from '../types.js';

export type JSXMiddlewareCallback = (
    type: ComponentOrIntrinsicElementTypeConstraint,
    props: Readonly<Record<string, unknown>>,
) => JSX.Element;

export interface JSXMiddleware {
    invoke(
        type: ComponentOrIntrinsicElementTypeConstraint,
        props: Readonly<Record<string, unknown>>,
        next: JSXMiddlewareCallback,
    ): JSX.Element;
}
