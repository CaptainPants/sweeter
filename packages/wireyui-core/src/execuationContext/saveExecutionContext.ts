import { popAndCall } from '../internal/popAndCall.js';
import { allExecutionContextVariables } from './internal/allExecutionContextVariables.js';

type RevertCallback = () => void;
type SavedExecutionContextVariable = () => RevertCallback;

export interface SavedExecutionContext {
    restore(): RevertCallback;
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
            popAndCall(revertList);
            throw ex;
        }

        return revertList;
    }

    return {
        restore() {
            const revertList = restoreAll();

            return () => {
                popAndCall(revertList);
            };
        },
    };
}
