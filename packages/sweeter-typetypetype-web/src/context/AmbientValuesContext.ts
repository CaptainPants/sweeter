import { Context, type MightBeSignal } from '@captainpants/sweeter-core';
import { type AmbientValueCallback } from '@captainpants/typeytypetype';

export interface AmbientValuesContextType {
    ambientValueCallback: MightBeSignal<(name: string) => unknown>;
}

export const AmbientValuesContext = new Context<
    MightBeSignal<AmbientValueCallback>
>('AmbientValues', {
    get: (name: string): unknown => {
        throw new TypeError('Not implemented');
    },
});
