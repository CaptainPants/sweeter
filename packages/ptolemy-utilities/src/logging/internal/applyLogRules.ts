import { LogLevelOrdinal } from '../LogLevels.js';
import { LogSink } from '../types.js';

import { globalLogRules } from './globalLogRules.js';

export function applyLogRules(
    minLevel: LogLevelOrdinal | undefined,
    maxLevel: LogLevelOrdinal | undefined,
    rules: readonly {
        category: string;
        minLevel: LogLevelOrdinal | undefined;
        maxLevel: LogLevelOrdinal | undefined;
    }[],
    sinks: readonly LogSink[],
) {
    globalLogRules.minLevel = minLevel;
    globalLogRules.maxLevel = maxLevel;

    globalLogRules.rules.clear();
    for (const item of rules) {
        globalLogRules.rules.set(item.category, {
            minLevel: item.minLevel,
            maxLevel: item.maxLevel,
        });
    }

    globalLogRules.sinks = sinks;
}
