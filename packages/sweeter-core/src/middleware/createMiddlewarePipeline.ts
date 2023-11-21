import { type JSXMiddleware, type JSXMiddlewareCallback } from './types.js';

export function createMiddlewarePipeline(
    middlewares: JSXMiddleware[],
    end: JSXMiddlewareCallback,
): JSXMiddlewareCallback {
    return (type, props) => {
        let callback = end;

        for (let i = middlewares.length - 1; i >= 0; --i) {
            // capture the callback value for use in the function below
            const next = callback;

            callback = (type, props) => {
                return next(type, props);
            };
        }

        return callback(type, props);
    };
}
