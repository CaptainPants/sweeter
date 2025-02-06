import { $derived } from '../signals/$derived.js';
import { isConstantSignal } from '../signals/isSignal.js';
import { type Component } from '../types/index.js';

export interface WithIdProps {
    basis?: string;

    children: (id: string) => JSX.Element;
}

export const WithId: Component<WithIdProps> = (
    { basis, children },
    init,
): JSX.Element => {
    const id = init.idGenerator.next(basis?.peek());

    // Shortcut to avoid a calculated signal
    if (isConstantSignal(children)) {
        return children.peek()(id);
    }

    return $derived(() => children.value(id));
};
