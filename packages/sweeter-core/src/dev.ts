let enabled: boolean = false;

export function isDeveloperModeEnabled() {
    return enabled;
}

export function enableDeveloperMode(value: boolean) {
    enabled = value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).sweeterDev = {
    isEnabled: isDeveloperModeEnabled,
    enable: enableDeveloperMode,
};
