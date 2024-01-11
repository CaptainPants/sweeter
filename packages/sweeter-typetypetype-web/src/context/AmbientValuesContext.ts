import { Context, type MightBeSignal } from '@captainpants/sweeter-core';

export interface AmbientValuesContextType {
    ambientValueCallback: MightBeSignal<(name: string) => unknown>;
}

export const AmbientValuesContext = new Context<
    MightBeSignal<(name: string) => unknown>
>('AmbientValues', (name: string): unknown => {
    throw new TypeError('Not implemented');
});
