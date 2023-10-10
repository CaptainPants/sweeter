
export interface BatchCompleteHandler {
    batchComplete(): void; 
}

let batchDepth = 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let deferredHandlers = new Set<BatchCompleteHandler>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deferForBatch(handler: BatchCompleteHandler): void {
    deferredHandlers.add(handler);
}

export function startBatch(): () => void {
    batchDepth += 1;
    let reverted = false;

    return () => {
        if (!reverted) {
            batchDepth -= 1;
            reverted = true;
            
            if (batchDepth === 0) {
                for (const item of deferredHandlers) {
                    item.batchComplete();
                }
                deferredHandlers = new Set();
            }
        }
    }
}

export function batch(callback: () => void): void {
    const revert = startBatch();
    try {
        callback();
    }
    finally {
        revert();
    }
}

export function isBatching(): boolean {
    return batchDepth > 0;
}