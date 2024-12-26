import { applyLogRules } from "./internal/applyLogRules";
import { LogLevel, LogLevelOrdinal, LogLevels } from "./LogLevels";
import { LogSink } from "./types";

export class LoggingBuilder {
    constructor() {
    }

    minLevel: LogLevelOrdinal | undefined;
    maxLevel: LogLevelOrdinal | undefined;

    rules: { category: string, minLevel: LogLevelOrdinal | undefined, maxLevel: LogLevelOrdinal | undefined }[] = [];

    sinks: LogSink[] = [];

    public setMinLevel(level: LogLevel): this {
        this.minLevel = LogLevels[level];
        return this;
    }
    public setMaxLevel(level: LogLevel): this {
        this.maxLevel = LogLevels[level];
        return this;
    }
    public addRule(category: string, minLevel: LogLevel | undefined, maxLevel: LogLevel | undefined): this {
        this.rules.push({ category, minLevel: minLevel === undefined ? undefined : LogLevels[minLevel], maxLevel: maxLevel === undefined ? undefined : LogLevels[maxLevel] });
        return this;
    }
    public addSink(sink: LogSink): this {
        this.sinks.push(sink);
        return this;
    }

    public apply(): void {
        applyLogRules(this.minLevel, this.maxLevel, this.rules, this.sinks);
    }
}