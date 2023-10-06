import { calc, mutable, valueOf } from '../index.js';
import type { Props } from '../types.js';
import { SuspenseContext } from './internal/SuspenseContext.js';

export interface SuspenseProps {
    fallback: () => JSX.Element;
    children: () => JSX.Element;
}

export function Suspense(props: Props<SuspenseProps>): JSX.Element;
export function Suspense({
    fallback,
    children,
}: Props<SuspenseProps>): JSX.Element {
    const counter = mutable(0);

    const suspenseCalculation = (): JSX.Element => {
        // Important to always call the children callback
        // as it will control the visibility of the fallback
        // must be a callback (called within a calc that 
        // captures the SuspenseContext)
        const childrenResult = valueOf(children)();

        if (counter.value > 0) {
            return valueOf(fallback)();
        }

        return childrenResult;
    };

    return SuspenseContext.invoke(
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
            get count () {
                return counter.peek();
            }
        },
        () => {
            // calc captures the ambient executionContext
            return calc(suspenseCalculation);
        },
    );
}
