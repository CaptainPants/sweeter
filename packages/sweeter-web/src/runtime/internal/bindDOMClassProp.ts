import {
    type ContextSnapshot,
    subscribeToChanges,
} from '@captainpants/sweeter-core';
import { createCssClassSignal } from '../../styles/createCssClassSignal.js';
import { type ElementCssClasses } from '../../styles/types.js';
import { type WebRuntime } from '../types.js';
import { addMountedCallback } from './mounting.js';
import { GlobalCssClass } from '../../styles/GlobalCssClass.js';

export function bindDOMClassProp(
    contextSnapshot: ContextSnapshot,
    ele: HTMLElement,
    class_: ElementCssClasses,
    webRuntime: WebRuntime,
) {
    const classSignal = createCssClassSignal(class_);

    let previousReferencedClasses: GlobalCssClass[] | undefined;

    addMountedCallback(contextSnapshot, ele, () => {
        const unsubscribe = subscribeToChanges(
            [classSignal],
            ([thisTime]) => {
                const thisTimeReferencedClasses = thisTime.filter(
                    (x): x is GlobalCssClass => x instanceof GlobalCssClass,
                );

                // If there was previous results we need to work out what items were added/removed
                if (previousReferencedClasses) {
                    const added = diffArray(
                        thisTimeReferencedClasses,
                        previousReferencedClasses,
                    );
                    const removed = diffArray(
                        previousReferencedClasses,
                        thisTimeReferencedClasses,
                    );

                    for (const addedItem of added) {
                        webRuntime.addStylesheet(addedItem);
                    }
                    for (const removedItem of removed) {
                        webRuntime.removeStylesheet(removedItem);
                    }
                } 
                // there was no previous result, so we add them all (and skip any diffing)
                else {
                    for (const addedItem of thisTimeReferencedClasses) {
                        webRuntime.addStylesheet(addedItem);
                    }
                }

                ele.className = thisTime
                    .map((x) =>
                        x instanceof GlobalCssClass
                            ? webRuntime.getPrefixedClassName(x)
                            : x,
                    )
                    .join(' ');

                // save (for change detection)
                previousReferencedClasses = thisTimeReferencedClasses;
            },
            true,
        );

        return () => {
            unsubscribe();

            if (previousReferencedClasses) {
                for (const removedItem of previousReferencedClasses) {
                    webRuntime.removeStylesheet(removedItem);
                }
            }
        };
    });
}
