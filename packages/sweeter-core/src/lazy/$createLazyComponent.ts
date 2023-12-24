import { $async } from '../components/Async.js';
import { $val } from '../signals/$val.js';
import { getRuntime } from '../runtime/Runtime.js';
import {
    type Component,
    type PropsWithIntrinsicAttributesFor,
} from '../types.js';
import { $lazy } from './$lazy.js';

export function $createLazyComponent<TProps>(
    callback: () => Promise<Component<TProps>>,
): Component<TProps> {
    const lazy = $lazy(callback);

    const result: Component<TProps> = (props, init) => {
        return $async(
            () => lazy.promise,
            (LoadedComponent) => {
                return getRuntime().jsx(
                    $val(LoadedComponent),
                    props as PropsWithIntrinsicAttributesFor<Component<TProps>>,
                );
            },
        );
    };

    return result;
}
