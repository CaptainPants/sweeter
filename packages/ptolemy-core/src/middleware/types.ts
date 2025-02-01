import { type ComponentOrIntrinsicElementTypeConstraint } from '../types.js';

export type JSXMiddlewareUnknownProps = Readonly<Record<string, unknown>>;

export type JSXMiddlewareCallback = (
    type: ComponentOrIntrinsicElementTypeConstraint,
    /**
     * Note that middleware is allowed to modify the props object, the
     * caller needs to make a defensive copy if they are reusing it.
     */
    props: JSXMiddlewareUnknownProps,
) => JSX.Element;

export interface JSXMiddleware {
    invoke(
        type: ComponentOrIntrinsicElementTypeConstraint,
        /**
         * Note that middleware is allowed to modify the props object, the
         * caller needs to make a defensive copy if they are reusing it.
         */
        props: JSXMiddlewareUnknownProps,
        next: JSXMiddlewareCallback,
    ): JSX.Element;
}
