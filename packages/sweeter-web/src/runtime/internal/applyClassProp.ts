import {
    type ContextSnapshot,
    subscribeToChanges,
} from '@captainpants/sweeter-core';
import { flattenCssClasses } from '../../styles/flattenCssClasses.js';
import { type ElementCssClasses } from '../../styles/types.js';
import { type WebRuntime } from '../types.js';
import { addMountedCallback } from './mounting.js';

export function applyClassProp(
    contextSnapshot: ContextSnapshot,
    ele: HTMLElement,
    class_: ElementCssClasses,
    webRuntime: WebRuntime,
) {
    const classSignal = flattenCssClasses(class_, webRuntime);

    // TODO: My goal is to automatically add / remove any referenced GlobalCssClasses to the page
    addMountedCallback(contextSnapshot, ele, () => {
        return subscribeToChanges(
            [classSignal],
            ([classValue]) => {
                ele.className = classValue;
            },
            true,
        );
    });
}
