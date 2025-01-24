import { type Component, type ComponentInit } from '../types.js';

export interface WithIdProps {
    basis?: string;

    children: (id: string) => JSX.Element;
}

export const WithId: Component<WithIdProps> = (
    { basis, children }: WithIdProps,
    init: ComponentInit,
): JSX.Element => {
    const id = init.idGenerator.next(basis);

    return children(id);
};
