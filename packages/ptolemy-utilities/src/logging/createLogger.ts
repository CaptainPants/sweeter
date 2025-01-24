import { CodeLocation } from '../CodeLocation.js';

import { LoggerImpl } from './internal/LoggerImpl.js';
import { type Logger } from './types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: readonly any[]) => any;

export function createLogger(
    namespace: string,
    category: string | AnyFunction,
): Logger;
export function createLogger(
    codeLocation: CodeLocation,
    category: string | AnyFunction,
): Logger;
export function createLogger(
    namespace: string | CodeLocation,
    category: string | AnyFunction,
): Logger {
    if (Array.isArray(namespace)) {
        const [file, , ,] = namespace;
        namespace = file;
    }

    const name = typeof category === 'string' ? category : category.name;

    return new LoggerImpl(namespace + ': ' + name);
}
