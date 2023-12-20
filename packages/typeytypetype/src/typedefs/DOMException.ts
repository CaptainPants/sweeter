declare global {
    /**
     * Minimal type definition for DOMException so that isAbortError and AbortController usage isn't incredibly annoying when not using DOM.
     */
    class DOMException {
        readonly name: string;
    }
}

export {};
