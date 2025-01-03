interface MeasurementNode {
    name: string;
    content?: (() => string | undefined) | undefined;
    date: number;
    timeout: number;
}

const nodes = new Set<MeasurementNode>();
const noop = () => {};

function monitorOperation(
    name: string,
    timeout: number,
    content?: () => string | undefined,
) {
    if (!dev.isEnabled) {
        return noop;
    }

    ping();

    const added: MeasurementNode = {
        name: name,
        content: content,
        date: Date.now(),
        timeout: timeout,
    };

    nodes.add(added);

    return () => {
        ping();

        // might have been deleted already (if it timed out)
        nodes.delete(added);
    };
}

/**
 * Check every monitored operation in progress and announce errors where needed.
 */
function ping() {
    const now = Date.now();

    const toRemove: MeasurementNode[] = [];

    for (const current of nodes) {
        if (now - current.date > current.timeout) {
            // problem
            console.warn(
                `Operation exceeded expected time window (${
                    current.timeout
                }ms): ${current.name} \n${current.content?.()}`,
            );

            if (globalEnabledFlags?.monitorOperations) {
                // eslint-disable-next-line no-debugger
                debugger;
            }
            toRemove.push(current);
        }
    }

    for (const node of toRemove) {
        nodes.delete(node);
    }
}

function swallowedError(message: string, err: unknown, ...args: unknown[]) {
    console.warn(message, err, ...args);
    if (dev.flag('breakpointOnSwallowedError')) {
        debugger; // Invoke debugger breakpoint here yay
    }
}

let globalEnabledFlags: DebugFlagValues | undefined;
let globalInterval: ReturnType<typeof setInterval> | undefined;

export type DebugFlagKey = (keyof SweeterExtensionPoints.DebugFlags) | (string & {} /* The &{} here is to allow intellisense */);
export type DebugFlagValues = Partial<Record<DebugFlagKey, boolean>>;

/**
 * Developer tools object.
 */
const dev = {
    get isEnabled() {
        return globalEnabledFlags;
    },
    flag(flag: DebugFlagKey): boolean {
        return globalEnabledFlags?.all ?? globalEnabledFlags?.[flag] ?? false;
    },
    /**
     * Enable/disable developer tooling.
     * @param flags
     */
    enable(flags: DebugFlagValues) {
        dev.disable();

        globalEnabledFlags = flags;

        if (flags.monitorOperations) {
            globalInterval = setInterval(ping, 1000);
        }
    },
    disable: () => {
        if (globalInterval) {
            clearInterval(globalInterval);
            globalInterval = undefined;
        }

        globalEnabledFlags = undefined;
    },
    monitorOperation,
    ping,
    swallowedError,
};
export { dev };
