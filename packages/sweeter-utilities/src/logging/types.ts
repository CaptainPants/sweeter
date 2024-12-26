import { LogLevel } from "./LogLevels";

export type LogMethod = {
    (message: string): void;
    (err: unknown, message: string): void;
    format(error?: unknown): (parts: TemplateStringsArray, ...parms: readonly unknown[]) => () => void;
}

export interface Logger {
    fatal: LogMethod;
    error: LogMethod;
    warning: LogMethod;
    info: LogMethod;
    debug: LogMethod;
    trace: LogMethod;

    category: string;
}

export interface LogSink {
    log(logLevel: LogLevel, category: string, message: string, err: unknown): void
}