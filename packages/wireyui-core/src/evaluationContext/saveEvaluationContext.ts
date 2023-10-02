import { allEvaluationContextVariables } from './internal/allEvaluationContextVariables.js';

type SavedEvaluationContextVariable = () => () => void;
export type SavedEvaluationContext = {
    restore: () => () => void;
};

function disposeAll(disposables: (() => void)[]) {
    for (
        let disposable = disposables.pop();
        disposable;
        disposable = disposables.pop()
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

    return {
        restore: () => {
            const cleanup: (() => void)[] = [];

            try {
                for (const restore of restoreList) {
                    cleanup.push(restore());
                }
            } catch (ex) {
                disposeAll(cleanup);
                throw ex;
            }

            return () => {
                disposeAll(cleanup);
            };
        },
    };
}
