
import { LogLevel } from "../LogLevels";
import { Logger, LogMethod } from "../types";
import { globalLogRules } from "./globalLogRules";

function createLogMethod(logLevel: LogLevel): LogMethod {
    function res(this: { category: string }, message: string): void;
    function res(this: { category: string }, error: unknown, message: string): void;
    function res(this: { category: string },errOrMessage: unknown | string, message?: string) {
        if (typeof errOrMessage !== 'string') {
            globalLogRules.log(logLevel, this.category, message!, errOrMessage);
        }
        else {
            globalLogRules.log(logLevel, this.category, errOrMessage);
        }
    };
    Object.defineProperty(
        res,
        'formatted',
        {
            get() {
                const self = this as Logger;
                
                if (!globalLogRules.isEnabled(logLevel, self.category)) {
                    return doNothing;
                }
        
                return (template: TemplateStringsArray, ...parms: readonly unknown[]) => {
                    const formatted = template.map((item, i) => item + (parms[i] ?? '')).join('');
        
                    return (err?: unknown | undefined) => {
                        globalLogRules.log(logLevel, self.category, formatted, err)
                    }
                }
            },
            configurable: false,
            enumerable: true
        }
    );
    Object.defineProperty(
        res,
        'isEnabled',
        {
            get() {
                const self = this as Logger;

                return globalLogRules.isEnabled(logLevel, self.category);
            },
            configurable: false,
            enumerable: true
        }
    );

    return res as never;
}

const doNothing = () => () => void 0;

export const prototype: Omit<Logger, 'category'> = {
    fatal: createLogMethod('FATAL'),
    error: createLogMethod('ERROR'),
    warning: createLogMethod('WARNING'),
    info: createLogMethod('INFO'),
    debug: createLogMethod('DEBUG'),
    trace: createLogMethod('TRACE'),
}

function LoggerImplFunc(this: Logger, category: string) {
    this.category = category;
}
LoggerImplFunc.prototype = prototype;

export const LoggerImpl = LoggerImplFunc as never as (new (category: string) => Logger);
