import { allContexts } from './internal/allContexts.js';

type SavedSingleContext = () => () => void;
export type SavedContext = {
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

export function saveAllContext(): SavedContext {
    const restoreList: SavedSingleContext[] = [];

    for (const item of allContexts) {
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
