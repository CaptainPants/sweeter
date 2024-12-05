import { dev } from '../dev.js';
import { popAndCallAll } from '../internal/popAndCallAll.js';
import { allExecutionContextVariables } from './internal/allExecutionContextVariables.js';

export type SavedExecutionContextRevertAgainCallback = () => void;
export type SavedExecutionContextRestoreCallback = () => SavedExecutionContextRevertAgainCallback;

export interface SavedExecutionContext {
    debugLog(): void;
    getDebugString(): string;
    restore(): SavedExecutionContextRevertAgainCallback;
    invokeWith<T>(callback: () => T): T;
}

export function saveExecutionContext(): SavedExecutionContext {
    const restoreList: { restore: SavedExecutionContextRestoreCallback, name: string, value: unknown }[] = [];

    for (const item of allExecutionContextVariables) {
        const saved = item.current;
        const saveExecutionContext_restore = () => item.replace(saved);
        restoreList.push({ restore: saveExecutionContext_restore, name: item.name, value: saved });
    }

    function restoreAll() {
        const revertList: SavedExecutionContextRevertAgainCallback[] = [];

        try {
            for (const item of restoreList) {
                revertList.push(item.restore());
            }
        } catch (ex) {
            popAndCallAll(revertList);
            throw ex;
        }

        return revertList;
    }

    return {
        getDebugString() {
            return restoreList.map(x => `${x.name}: ${String(x.value)}`).join(';\r\n');
        },
        debugLog() {
            console.log('==== Execuation Context ====');
            for (const item of restoreList) {
                console.log(item.name, item.value);
            }
            console.log('==== END OF Execuation Context ====');
        },
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
