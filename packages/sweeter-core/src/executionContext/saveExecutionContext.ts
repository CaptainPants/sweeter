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
        const saveExecutionContext_revert = () => item.replace(saved);
        restoreList.push(saveExecutionContext_revert);
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
