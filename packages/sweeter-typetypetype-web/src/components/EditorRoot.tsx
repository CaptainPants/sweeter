import {
    type AmbientValueCallback,
    asUnknown,
    type Model,
    type Replacer,
} from '@captainpants/typeytypetype';

import { AmbientValues } from './AmbientValues.js';
import { EditorHost } from './EditorHost.js';
import { type EditorSettings } from '../types.js';
import {
    EditorHostContext,
    type EditorHostContextType,
} from '../context/EditorHostContext.js';
import { $calc, $val } from '@captainpants/sweeter-core';
import { hasOwnProperty } from '@captainpants/sweeter-utilities';

export interface EditorRootProps<T> {
    model: Model<T>;
    replace: Replacer<T>;
    settings?: EditorSettings;

    idPath?: string;

    // TODO: we should just use a callback for this and rely on signals for invalidation
    ambientValues?: Record<string, unknown>;
}

/**
 * Constant default settings so that the default value doesn't cause constant re-renders from updating the context value.
 */
const defaultSettings = Object.freeze({});

/**
 * The main entry point for an editor structure.
 * @param props
 */
export function EditorRoot<T>(props: Readonly<EditorRootProps<T>>): JSX.Element;
export function EditorRoot<T>({
    model,
    replace,
    settings = defaultSettings,
    idPath,
    ambientValues,
}: Readonly<EditorRootProps<T>>): JSX.Element {
    return $calc(() => {
        const hostContext: EditorHostContextType = {
            settings: $val(settings),
        };

        const resolvedAmbientValues = $val(ambientValues);

        let newAmbientValuesCallback: AmbientValueCallback | undefined;

        if (resolvedAmbientValues) {
            newAmbientValuesCallback = {
                get: (name: string): unknown => {
                    if (hasOwnProperty(resolvedAmbientValues, name)) {
                        return {
                            exists: true,
                            getValue: () => resolvedAmbientValues[name],
                        };
                    }
                    return undefined;
                },
            };
        }

        // Cheating the type system here a bit (replace as any)
        // we'll need the editors themselves to validate that their models are the right type
        return (
            <AmbientValues callback={newAmbientValuesCallback}>
                {() =>
                    EditorHostContext.invokeWith(hostContext, () => (
                        <EditorHost
                            model={asUnknown(model)}
                            replace={replace as unknown as Replacer<unknown>}
                            indent={0}
                            isRoot
                            idPath={idPath}
                        />
                    ))
                }
            </AmbientValues>
        );
    });
}
