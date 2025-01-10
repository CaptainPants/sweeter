import { CodeLocation } from '../CodeLocation.js';
import { LoggerImpl } from './internal/LoggerImpl.js';
import { type Logger } from './types.js';

export function createLogger(
    namespace: string,
    category: string | Function,
): Logger;
export function createLogger(
    codeLocation: CodeLocation,
    category: string | Function,
): Logger;
export function createLogger(
    namespace: string | CodeLocation,
    category: string | Function,
): Logger {
    if (Array.isArray(namespace)) {
        const [file, , , ] = namespace;
        namespace = file;
    }

    const name = typeof category === 'string' ? category : category.name;

    return new LoggerImpl(namespace + ': ' + name);
}
