import { RuntimeContext } from '../index.js';
import { $calc, $mutable, valueOf } from '../signals/index.js';
import type { ComponentInit, Props } from '../types.js';
import { SuspenseContext } from './SuspenseContext.js';

export interface SuspenseProps {
    fallback: () => JSX.Element;
    children: () => JSX.Element;
}

export function Suspense(
    props: Props<SuspenseProps>,
    init: ComponentInit,
): JSX.Element;
export function Suspense(
    { fallback, children }: Props<SuspenseProps>,
    init: ComponentInit,
): JSX.Element {
    // Component renders are specifically untracked, so this doesn't subscribe yay.
    const counter = $mutable(0);

    const runtime = RuntimeContext.getCurrent();

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
        () => {
            const evaluatedChildren = $calc(() => {
                return valueOf(children)();
            });

            const suspenseCalculation = (): JSX.Element => {
                // Important to always call the children callback
                // as it will control the visibility of the fallback
                // must be a callback (called within a calc that
                // captures the SuspenseContext)

                if (counter.value > 0) {
                    return [
                        valueOf(fallback)(),
                        runtime.renderOffscreen(evaluatedChildren.value),
                    ];
                }

                return evaluatedChildren.value;
            };

            // calc captures the ambient executionContext
            return $calc(suspenseCalculation);
        },
    );
}
