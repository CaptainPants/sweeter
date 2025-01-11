import { type AmbientValueCallback } from '@captainpants/sweeter-arktype-modeling';
import { Context, type MightBeSignal } from '@captainpants/sweeter-core';

export interface AmbientValuesContextType {
    ambientValueCallback: MightBeSignal<(name: string) => unknown>;
}

export const AmbientValuesContext = new Context<
    MightBeSignal<AmbientValueCallback>
>('AmbientValues', {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- default implementation doesn't use the parameter
    get: (name: string): unknown => {
        throw new TypeError('Not implemented');
    },
});
