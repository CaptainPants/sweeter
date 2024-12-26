import { LogLevel } from "./LogLevels";
import { LogSink } from "./types";

export class ConsoleLogSink implements LogSink {
    log(logLevel: LogLevel, message: string, err: unknown): void {
        let logMethod: typeof console.log;
        
        switch (logLevel){ 
            case "FATAL": logMethod = console.error; break;
            case "ERROR": logMethod = console.error; break;
            case "WARNING": logMethod = console.warn; break;
            case "INFO": logMethod = console.info; break;
            case "DEBUG": logMethod = console.debug; break;
            case "TRACE":logMethod = console.debug; break;
        }

        logMethod(logLevel + ': ', message, err);
    }
}