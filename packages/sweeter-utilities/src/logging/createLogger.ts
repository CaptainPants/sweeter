
import { assertNotNullOrUndefined } from "../assertNotNullOrUndefined.js";
import { CodeLocation } from "../CodeLocation.js";
import { LoggerImpl } from "./internal/LoggerImpl.js";
import { type Logger } from "./types.js";

export function createLogger(namespace: string, category: string | Function): Logger;
export function createLogger(codeLocation: CodeLocation): Logger;
export function createLogger(namespace: string | CodeLocation, category?: string | Function | undefined): Logger {
    let name: string;
    if (Array.isArray(namespace)) {
        const [file, func, row, col] = namespace;
        name = func;
        namespace = file;
    }
    else {
        assertNotNullOrUndefined(category);
        name = (typeof category === 'string' ? category : category.name);
    }
    return new LoggerImpl(namespace + ': ' + name);
}