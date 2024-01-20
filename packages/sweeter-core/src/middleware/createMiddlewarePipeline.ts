import { StackTrace } from '@captainpants/sweeter-utilities';
import { dev } from '../dev.js';
import { type JSXMiddleware, type JSXMiddlewareCallback } from './types.js';

export function createMiddlewarePipeline(
    middlewares: JSXMiddleware[],
    end: JSXMiddlewareCallback,
): JSXMiddlewareCallback {
    let callback = end;

    for (let i = middlewares.length - 1; i >= 0; --i) {
        // capture the callback value for use in the function below
        const next = callback;

        callback = (type, props) => {
            return next(type, props);
        };
    }

    if (dev.flag('monitorOperations')) {
        const next = callback;
        callback = (type, props) => {
            const stacktrace = new StackTrace();

            const cleanup = dev.monitorOperation(
                `Rendering ${typeof type === 'string' ? type : type.name}`,
                1000,
                () => stacktrace.getNice(),
            );
            try {
                return next(type, props);
            } finally {
                cleanup();
            }
        };
    }

    return (type, props) => {
        return callback(type, props);
    };
}
