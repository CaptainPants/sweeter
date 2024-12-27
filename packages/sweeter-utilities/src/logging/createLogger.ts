import { assertNotNullOrUndefined } from '../assertNotNullOrUndefined.js';
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
    let name: string;
    if (Array.isArray(namespace)) {
        const [file, func, row, col] = namespace;
        namespace = file;
    }

    name = typeof category === 'string' ? category : category.name;

    return new LoggerImpl(namespace + ': ' + name);
}
