import { Context } from '@captainpants/sweeter-core';

export const AmbientValuesContext = new Context('AmbientValues', {
    ambientValueCallback(name: string): unknown {
        throw new TypeError('Not implemented');
    },
});
