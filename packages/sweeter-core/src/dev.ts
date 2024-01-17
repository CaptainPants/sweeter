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
            console.error(
                `Operation exceeded expected time window (${
                    current.timeout
                }ms): ${current.name} \n${current.content?.()}`,
            );

            if (globalDebugger) {
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

let globalEnabled = false;
let globalDebugger = false;
let globalInterval: ReturnType<typeof setInterval> | undefined;

/**
 * Developer tools object.
 */
const dev = {
    get isEnabled() {
        return globalEnabled;
    },
    /**
     * Enable/disable developer tooling.
     * @param enabled Turn on developer tooling.
     * @param invokeDebugger Use the debugger keyword to trigger a breakpoint when there is a monitoring error.
     */
    enable(enabled: boolean, invokeDebugger: boolean = false) {
        if (globalInterval) {
            clearInterval(globalInterval);
            globalInterval = undefined;
        }

        globalEnabled = enabled;
        globalDebugger = invokeDebugger;

        if (enabled) {
            globalInterval = setInterval(ping, 1000);
        }
    },
    monitorOperation,
    ping,
};
export { dev };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).sweeterDev = dev;
