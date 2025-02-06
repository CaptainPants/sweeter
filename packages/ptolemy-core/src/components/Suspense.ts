import { $derived } from '../signals/$derived.js';
import { $mutable } from '../signals/$mutable.js';
import { type Component } from '../types/index.js';
import { $insertLocation } from '../utility/$insertLocation.js';

import { SuspenseContext } from './SuspenseContext.js';

export interface SuspenseProps {
    fallback: () => JSX.Element;
    children: () => JSX.Element;
}

export const Suspense: Component<SuspenseProps> = (
    { fallback, children },
    init,
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
            // This is separately signalified from suspenseCalculation so that it
            // is not rerun any time counter.value changes (and triggers
            // suspenseCalculation) to rerun.
            const evaluatedChildren = $derived(() => {
                // Important to always call the children callback
                // inside the suspense context, as it will control
                // the visibility of the fallback must be a callback
                // (called within a calc that captures the
                // SuspenseContext)
                return children.value();
            });

            const suspenseCalculation = (): JSX.Element => {
                if (counter.value > 0) {
                    return [
                        fallback.value(),
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
