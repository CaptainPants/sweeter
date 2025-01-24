export const LogLevels = {
    FATAL: 6,
    ERROR: 5,
    WARNING: 4,
    INFO: 3,
    DEBUG: 2,
    TRACE: 1,
} as const;

export type LogLevelOrdinal = (typeof LogLevels)[keyof typeof LogLevels];

export type LogLevel = keyof typeof LogLevels;
