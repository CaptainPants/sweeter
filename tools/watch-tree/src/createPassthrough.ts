import { Readable } from "node:stream";
import stripAnsi from 'strip-ansi';

export function createPassthrough(source: Readable, callback: (strippger: string, original: string) => void) {
    function invokeCallback(line: string) {
        const stripped = stripAnsi(line);
        callback(stripped, line);
    }

    const eater = createLineProcessor();

    function listener(data: string) {
        eater.add(data);

        for (;;) {
            const line = eater.readCompleteLine();

            if (line === null) {
                break;
            }

            invokeCallback(line);
        }
    };

    source.setEncoding('utf-8');
    source.addListener('data', listener);

    function flush() {
        const rest = eater.readToEnd();

        for (const line of rest) {
            invokeCallback(line);
        }
    }

    function remove() {
        source.removeListener('data', listener);
    }

    return { flush: flush, remove };
}

function createLineProcessor(): { add(data: string): void; readCompleteLine(): string | null, readToEnd(): string[] } {
    let remaining: string | null = null;

    function readCompleteLine() {
        if (remaining === null) {
            return null;
        }

        const index = remaining.indexOf('\n');
        if (index < 0) {
            return null; // If we don't have a full line
        }

        const res = remaining.substring(0, index);
        remaining = remaining.substring(index + 1);
        return res;
    }

    function readToEnd(): string [] {
        const temp = remaining;
        remaining = null;
        if (temp === null) {
            return [];
        }
        return temp.split('\n');
    }

    function add(data: string) {
        remaining = (remaining ?? '') + data;
    }

    return {
        readCompleteLine, 
        add, 
        readToEnd
    }
}
