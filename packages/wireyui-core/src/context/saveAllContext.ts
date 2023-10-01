import { allContexts } from './internal/allContexts.js';

type SavedSingleContext = () => Disposable;
export type SavedContext = {
    restore: () => Disposable;
};

function disposeAll(disposables: Disposable[]) {
    for (let item = disposables.pop(); item; item = disposables.pop()) {
        item[Symbol.dispose]();
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
            const cleanup: Disposable[] = [];

            try {
                for (const restore of restoreList) {
                    cleanup.push(restore());
                }
            } catch (ex) {
                disposeAll(cleanup);
                throw ex;
            }

            return {
                [Symbol.dispose]() {
                    disposeAll(cleanup);
                },
            };
        },
    };
}
