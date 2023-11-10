
import { popAndCallAll } from '../internal/popAndCallAll.js';
import { allExecutionContextVariables } from './internal/allExecutionContextVariables.js';

type RevertCallback = () => void;
type SavedExecutionContextVariable = () => RevertCallback;

export interface SavedExecutionContext {
    restore(): RevertCallback;
    invokeWith<T>(callback: () => T): T;
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
