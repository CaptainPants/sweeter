import { popAndCallAll } from '../internal/popAndCallAll.js';
import { allExecutionContextVariables } from './internal/allExecutionContextVariables.js';

export type SavedExecutionContextRevertCallback = () => void;

export interface SavedExecutionContext {
    restore(): SavedExecutionContextRevertCallback;
    invokeWith<T>(callback: () => T): T;
}

export function saveExecutionContext(): SavedExecutionContext {
    const restoreList: (() => SavedExecutionContextRevertCallback)[] = [];

    for (const item of allExecutionContextVariables) {
        const saved = item.current;
        restoreList.push(() => item.replace(saved));
    }

    function restoreAll() {
        const revertList: SavedExecutionContextRevertCallback[] = [];

        try {
            for (const restore of restoreList) {
                revertList.push(restore());
            }
        } catch (ex) {
            popAndCallAll(revertList);
            throw ex;
        }

        return revertList;
    }

    return {
        restore() {
            const revertList = restoreAll();

            return () => {
                popAndCallAll(revertList);
            };
        },
        invokeWith(callback) {
            const revertList = restoreAll();
            try {
                return callback();
            } finally {
                popAndCallAll(revertList);
            }
        },
    };
}
