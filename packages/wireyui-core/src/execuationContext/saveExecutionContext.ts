import { allExecutionContextVariables } from './internal/allExecutionContextVariables.js';

type RevertCallback = () => void;
type SavedExecutionContextVariable = () => RevertCallback;

export interface SavedExecutionContext {
    restore(): RevertCallback;
}

function invokeAll(callbacks: (() => void)[]) {
    for (
        let disposable = callbacks.pop();
        disposable;
        disposable = callbacks.pop()
    ) {
        disposable();
    }
}

export function saveExecutionContext(): SavedExecutionContext {
    const restoreList: SavedExecutionContextVariable[] = [];

    for (const item of allExecutionContextVariables) {
        const saved = item.current;
        restoreList.push(() => item.replace(saved));
    }

    function restoreAll() {
        const revertList: RevertCallback[] = [];

        try {
            for (const restore of restoreList) {
                revertList.push(restore());
            }
        } catch (ex) {
            invokeAll(revertList);
            throw ex;
        }

        return revertList;
    }

    return {
        restore() {
            const revertList = restoreAll();

            return () => {
                invokeAll(revertList);
            };
        },
    };
}
