import { $derived } from '../signals/$derived.js';
import { $mutable } from '../signals/$mutable.js';
import { $val } from '../signals/$val.js';
import {
    type Component,
    type ComponentInit,
    type PropertiesMightBeSignals,
} from '../types.js';
import { $insertLocation } from '../utility/$insertLocation.js';

import { SuspenseContext } from './SuspenseContext.js';

export type SuspenseProps = PropertiesMightBeSignals<{
    fallback: () => JSX.Element;
    children: () => JSX.Element;
}>;

export const Suspense: Component<SuspenseProps> = (
    { fallback, children }: SuspenseProps,
    init: ComponentInit,
): JSX.Element => {
    // Component renders are specifically untracked, so this doesn't subscribe yay.
    const counter = $mutable(0);

    const runtime = init.runtime;

    return SuspenseContext.invokeWith(
        {
            startBlocking: () => {
                let reverterCalled = false;
                counter.value += 1;

                return () => {
                    if (!reverterCalled) {
                        reverterCalled = true;
                        counter.value -= 1;
                    }
                };
            },
            get count() {
                return counter.peek();
            },
        },
        $insertLocation(),
        () => {
            const evaluatedChildren = $derived(() => {
                return $val(children)();
            });

            const suspenseCalculation = (): JSX.Element => {
                // Important to always call the children callback
                // as it will control the visibility of the fallback
                // must be a callback (called within a calc that
                // captures the SuspenseContext)

                if (counter.value > 0) {
                    return [
                        $val(fallback)(),
                        runtime.renderOffscreen(evaluatedChildren.value),
                    ];
                }

                return evaluatedChildren.value;
            };

            // calc captures the ambient executionContext
            return $derived(suspenseCalculation);
        },
    );
};
