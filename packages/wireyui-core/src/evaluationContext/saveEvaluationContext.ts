import { allEvaluationContextVariables } from './internal/allEvaluationContextVariables.js';

type SavedEvaluationContextVariable = () => () => void;
export type SavedEvaluationContext = {
    restore: () => () => void;
};

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
        const cleanup: (() => void)[] = [];

        try {
            for (const restore of restoreList) {
                cleanup.push(restore());
            }
        } catch (ex) {
            invokeAll(cleanup);
            throw ex;
        }

        return cleanup;
    }

    return {
        restore() {
            const cleanup = restoreAll();

            return () => {
                invokeAll(cleanup);
            };
        },
    };
}
