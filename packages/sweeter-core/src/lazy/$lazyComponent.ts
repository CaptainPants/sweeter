import { Async } from '../components/Async.js';
import { $calc } from '../signals/$calc.js';
import { $val } from '../signals/$val.js';
import { getRuntime } from '../runtime/Runtime.js';
import {
    type AnyComponent,
    type Component,
    type PropsWithIntrinsicAttributesFor,
} from '../types.js';
import { $lazy } from './$lazy.js';

export function $lazyComponent<TProps>(
    callback: () => Promise<AnyComponent<TProps>>,
): Component<TProps> {
    const lazy = $lazy(callback);

    const result: Component<TProps> = (props, init) => {
        return getRuntime().jsx(Async<AnyComponent<TProps>>, {
            loadData: () => lazy.promise,
            children: (LoadedComponent) =>
                $calc(() =>
                    getRuntime().jsx(
                        $val(LoadedComponent),
                        props as PropsWithIntrinsicAttributesFor<
                            Component<TProps>
                        >,
                    ),
                ),
        });
    };

    return result;
}
