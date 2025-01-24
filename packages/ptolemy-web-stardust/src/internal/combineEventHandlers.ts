import { $peek, type MightBeSignal } from '@serpentis/ptolemy-core';
import { type TypedEvent } from '@serpentis/ptolemy-web';

export function combineEventHandlers<
    TElement extends Element,
    TEvent extends Event,
>(
    ...handlers: MightBeSignal<
        ((evt: TypedEvent<TElement, TEvent>) => void) | undefined
    >[]
): (evt: TypedEvent<TElement, TEvent>) => void {
    return (evt) => {
        for (const handler of handlers) {
            $peek(handler)?.(evt);
        }
    };
}
