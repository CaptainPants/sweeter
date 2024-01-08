import {
    type ContextualValueCalculationContext,
    type Model,
    type PropertyModel,
} from '@captainpants/typeytypetype';
import {
    LocalizerHook,
    type ComponentInit,
    type Signal,
} from '@captainpants/sweeter-core';

import { idPaths } from '../idPaths.js';
import { SetupContextualValueCallbacksHook } from '../hooks/SetupContextualValueCallbacksHook.js';
import { AmbientValues } from '../components/AmbientValues.js';
import { EditorHost } from '../components/EditorHost.js';

export interface PropertyEditorPartProps {
    ownerSignal: Signal<Record<string, unknown>>;
    propertyModel: PropertyModel<unknown>;
    updateValue: (
        property: PropertyModel<unknown>,
        value: Model<unknown>,
    ) => Promise<void>;

    indent: number;
    ownerIdPath: string | undefined;
}

export function PropertyEditorPart(
    {
        ownerSignal,
        propertyModel,
        updateValue,
        indent,
        ownerIdPath,
    }: PropertyEditorPartProps,
    init: ComponentInit,
): JSX.Element {
    const idPath = idPaths.key(ownerIdPath, propertyModel.name);

    const { definition: propertyDefinition, valueModel: propertyValue } =
        propertyModel;

    // Stable
    const replace = async (value: Model<unknown>) => {
        await updateValue(propertyModel, value);
    };

    const { localize } = init.hook(LocalizerHook);

    const calculateLocal = (
        name: string,
        context: ContextualValueCalculationContext,
    ) => propertyModel.definition.getLocalValue(name, ownerSignal, context);
    const calculateAmbient = (
        name: string,
        context: ContextualValueCalculationContext,
    ) => propertyModel.definition.getAmbientValue(name, ownerSignal, context);

    const { local, ambient } = init.hook(
        SetupContextualValueCallbacksHook,
        calculateLocal,
        calculateAmbient,
    );

    return (
        <AmbientValues callback={ambient}>
            {() => (
                <EditorHost
                    model={propertyValue}
                    replace={replace}
                    propertyDisplayName={localize(
                        propertyDefinition.displayName ?? propertyModel.name,
                    )}
                    indent={indent}
                    idPath={idPath}
                    local={local}
                />
            )}
        </AmbientValues>
    );
}
