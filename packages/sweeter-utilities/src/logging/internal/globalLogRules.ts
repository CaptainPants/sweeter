import { LogLevel, LogLevelOrdinal, LogLevels } from "../LogLevels";
import { LogSink } from "../types";

export const globalLogRules = {
    minLevel: undefined as (LogLevelOrdinal | undefined),
    maxLevel: undefined as (LogLevelOrdinal | undefined),
    rules: new Map<string, {  minLevel: LogLevelOrdinal | undefined, maxLevel: LogLevelOrdinal | undefined }>(),
    sinks: [] as readonly LogSink[],

    log: (logLevel: LogLevel, category: string, message: string, err?: unknown) => {
        if (!isEnabled(logLevel, category)) { 
            return;
        }

        for (const sink of globalLogRules.sinks) {
            sink.log(logLevel, category, message, err);
        }
    },

    isEnabled: isEnabled
}

function isEnabled(logLevel: LogLevel, category: string) {
    const levelOrd = LogLevels[logLevel];

    if (globalLogRules.minLevel !== undefined && levelOrd < globalLogRules.minLevel){
        return false;   
    }

    if (globalLogRules.maxLevel !== undefined && levelOrd < globalLogRules.maxLevel){
        return false;
    }

    const found = globalLogRules.rules.get(category);
    if (!found) {
        return true;
    }

    if (found.minLevel !== undefined && levelOrd < found.minLevel){
        return false;   
    }

    if (found.maxLevel !== undefined && levelOrd < found.maxLevel){
        return false;
    }

    return true;
}