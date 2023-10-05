import { calc, mutable, valueOf } from '../index.js';
import type { Props } from '../types.js';
import { SuspenseContext } from './internal/SuspenseContext.js';

export interface SuspenseProps {
    fallback: JSX.Element;
    children: JSX.Element;
}

export function Suspense(props: Props<SuspenseProps>): JSX.Element;
export function Suspense({
    fallback,
    children,
}: Props<SuspenseProps>): JSX.Element {
    const counter = mutable(0);

    const suspenseCalculation = (): JSX.Element => {
        if (counter.value > 0) {
            return valueOf(fallback);
        }

        return valueOf(children);
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
        },
        () => {
            // calc captures the ambient executionContext
            return calc(suspenseCalculation);
        },
    );
}
