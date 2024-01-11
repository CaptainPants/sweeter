import {
    type ContextualValueCalculationContext,
    type Model,
    type PropertyModel,
} from '@captainpants/typeytypetype';
import {
    LocalizerHook,
    type ComponentInit,
    type PropertiesMightBeSignals,
    $calc,
    $val,
    $peek,
    $recalcOnChange,
} from '@captainpants/sweeter-core';

import { idPaths } from '../idPaths.js';
import { SetupContextualValueCallbacksHook } from '../hooks/SetupContextualValueCallbacksHook.js';
import { AmbientValues } from '../components/AmbientValues.js';
import { EditorHost } from '../components/EditorHost.js';
import { $wrap } from '@captainpants/sweeter-core';

export type PropertyEditorPartProps = PropertiesMightBeSignals<{
    owner: Record<string, unknown>;
    propertyModel: PropertyModel<unknown>;
    updateValue: (
        property: PropertyModel<unknown>,
        value: Model<unknown>,
    ) => Promise<void>;

    indent: number;
    ownerIdPath: string | undefined;
}>;

export function PropertyEditorPart(
    {
        owner,
        propertyModel,
        updateValue,
        indent,
        ownerIdPath,
    }: PropertyEditorPartProps,
    init: ComponentInit,
): JSX.Element {
    const idPath = $calc(() =>
        idPaths.key($val(ownerIdPath), $val(propertyModel).name),
    );

    // Stable
    const replace = async (value: Model<unknown>) => {
        await $peek(updateValue)($peek(propertyModel), value);
    };

    const { localize } = init.hook(LocalizerHook);

    const calculateLocal = $calc(() => {
        $recalcOnChange(propertyModel);
        $recalcOnChange(owner);

        return (name: string, context: ContextualValueCalculationContext) =>
            $peek(propertyModel).definition.getLocalValue(
                name,
                $wrap(owner),
                context,
            );
    });
    
    const calculateAmbient = $calc(() => {
        $recalcOnChange(propertyModel);
        $recalcOnChange(owner);

        return (name: string, context: ContextualValueCalculationContext) =>
            $peek(propertyModel).definition.getAmbientValue(
                name,
                $wrap(owner),
                context,
            );
    });

    const { local, ambient } = init.hook(
        SetupContextualValueCallbacksHook,
        calculateLocal,
        calculateAmbient,
    );

    return $calc(() => {
        const { definition: propertyDefinition, valueModel: propertyValue } =
            $val(propertyModel);

        return (
            <AmbientValues callback={ambient}>
                {() => (
                    <EditorHost
                        model={propertyValue}
                        replace={replace}
                        propertyDisplayName={localize(
                            propertyDefinition.displayName ??
                                $val(propertyModel).name,
                        )}
                        indent={indent}
                        idPath={idPath}
                        local={local}
                    />
                )}
            </AmbientValues>
        );
    });
}
