import {
    type ContextSnapshot,
    subscribeToChanges,
} from '@captainpants/sweeter-core';
import { createCssClassSignal } from '../../styles/createCssClassSignal.js';
import { type ElementCssClasses } from '../../styles/types.js';
import { type WebRuntime } from '../types.js';
import { addMountedCallback } from './mounting.js';
import { GlobalCssClass } from '../../index.js';

export function applyClassProp(
    contextSnapshot: ContextSnapshot,
    ele: HTMLElement,
    class_: ElementCssClasses,
    webRuntime: WebRuntime,
) {
    const classSignal = createCssClassSignal(class_);

    // TODO: My goal is to automatically add / remove any referenced GlobalCssClasses to the page
    addMountedCallback(contextSnapshot, ele, () => {
        return subscribeToChanges(
            [classSignal],
            ([thisTime]) => {
                ele.className = thisTime
                    .map((x) =>
                        x instanceof GlobalCssClass
                            ? webRuntime.getPrefixedClassName(x)
                            : x,
                    )
                    .join(' ');
            },
            true,
        );
    });
}