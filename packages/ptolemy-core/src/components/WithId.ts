import { type Component, PropTreatment } from '../types.js';

export interface WithIdProps {
    basis: PropTreatment<string, false>;

    children: PropTreatment<(id: string) => JSX.Element, false>;
}

export const WithId: Component<WithIdProps> = (
    { basis, children },
    init,
): JSX.Element => {
    const id = init.idGenerator.next(basis);

    return children(id);
};
