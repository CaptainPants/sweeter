import { allEvaluationContextVariables } from './internal/allEvaluationContextVariables.js';

type RevertCallback = () => void;
type SavedEvaluationContextVariable = () => RevertCallback;

export interface SavedEvaluationContext {
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

export function saveEvaluationContext(): SavedEvaluationContext {
    const restoreList: SavedEvaluationContextVariable[] = [];

    for (const item of allEvaluationContextVariables) {
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
