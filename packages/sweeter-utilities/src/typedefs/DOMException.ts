declare global {
    /**
     * Minimal type definition for DOMException so that isAbortError and AbortController usage isn't incredibly annoying when not using DOM.
     */
    class DOMException extends Error {
        readonly name: string;

        constructor(message?: string, name?: string);
    }
}


// NOTE: Rollup doesn't like it if you directly export DOMException, hence creating a const variable and then exporting with an alias.
/**
 * This export mostly exists so that you do import DOMException for code that runs with or without a DOM.
 */
const _DOMException = DOMException;

export { _DOMException as DOMException };
