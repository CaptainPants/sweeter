import { LogLevel } from "./LogLevels";

export type LogMethod = {
    (message: string): void;
    (err: unknown, message: string): void;
    formatted: (parts: TemplateStringsArray, ...parms: readonly unknown[]) => (error?: unknown) => void;
    isEnabled: boolean;
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