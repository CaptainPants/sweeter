/**
 * Developer tools object.
 */
const dev =  {
    /**
     * Enable developer tooling.
     */
    enabled: false
};
export { dev };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).sweeterDev = dev;