import { $async } from '../components/Async.js';
import { getRuntime } from '../runtime/Runtime.js';
import { $val } from '../signals/$val.js';
import {
    PropsOutputFromParam,
    PropsParam,
    type Component,
    type PropsInputFor,
} from '../types/index.js';

import { $lazy } from './$lazy.js';

/**
 * Create a new lazy loaded component - to be used for SPA-style applications.
 * @param callback
 * @returns
 */
export function $lazyComponentType<TProps>(
    callback: () => Promise<Component<TProps>>,
): Component<TProps> {
    const lazy = $lazy(callback);

    // This is a lot simpler if the prop type is unknown
    // so we do this and then assert it to the correct type later
    const result: Component<unknown> = (props) => {
        return $async(
            () => lazy.promise,
            (LoadedComponent) => {
                return getRuntime().jsx(
                    LoadedComponent.value,
                    props as PropsInputFor<Component<TProps>>,
                );
            },
        );
    };
    result.propMappings = (input) => input;

    return result as Component<TProps>;
}
