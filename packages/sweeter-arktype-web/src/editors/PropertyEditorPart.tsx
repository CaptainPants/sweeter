import {
    type UnknownPropertyModel,
    type ContextualValueCalculationContext,
    type Model,
    type UnknownModel,
} from '@captainpants/arktype-modeling';
import {
    LocalizerHook,
    type ComponentInit,
    type PropertiesMightBeSignals,
    $calc,
    $val,
    $peek,
    $invalidateOnChange,
} from '@captainpants/sweeter-core';

import { SetupContextualValueCallbacksHook } from '../hooks/SetupContextualValueCallbacksHook.js';
import { AmbientValues } from '../components/AmbientValues.js';
import { EditorHost } from '../components/EditorHost.js';
import { $wrap } from '@captainpants/sweeter-core';
import { idPaths } from '@captainpants/sweeter-utilities';

export type PropertyEditorPartProps = PropertiesMightBeSignals<{
    id: string;

    owner: Record<string, unknown>;
    propertyModel: UnknownPropertyModel;
    updateValue: (
        property: UnknownPropertyModel,
        value: UnknownModel,
    ) => Promise<void>;

    indent: number;
    ownerIdPath: string | undefined;
}>;

export function PropertyEditorPart(
    {
        id,
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

    const replace = async (value: UnknownModel) => {
        await $peek(updateValue)($peek(propertyModel), value);
    };

    const { localize } = init.hook(LocalizerHook);

    const calculateLocal = $calc(() => {
        const propertyModelResolved = $val(propertyModel);
        $invalidateOnChange(owner);

        return (name: string, context: ContextualValueCalculationContext) =>
            propertyModelResolved.valueModel.type
                .meta()
                .getLocalValueForUnknown(name, $wrap(owner), context);
    });

    const calculateAmbient = $calc(() => {
        const propertyModelResolved = $val(propertyModel);
        $invalidateOnChange(owner);

        return (name: string, context: ContextualValueCalculationContext) =>
            propertyModelResolved.valueModel.type
                .meta()
                .getAmbientValueForUnknown(name, $wrap(owner), context);
    });

    const { local, ambient } = init.hook(
        SetupContextualValueCallbacksHook,
        calculateLocal,
        calculateAmbient,
    );

    const valueModel = $calc(() => $val(propertyModel).valueModel);
    const displayName = $calc(
        () =>
            $val(propertyModel).valueModel.type.meta().displayName() ??
            $val(propertyModel).name,
    );

    return $calc(() => {
        return (
            <AmbientValues callback={ambient}>
                {() => (
                    <EditorHost
                        id={id}
                        model={valueModel}
                        replace={replace}
                        propertyDisplayName={localize(displayName.value)}
                        indent={indent}
                        idPath={idPath}
                        local={local}
                    />
                )}
            </AmbientValues>
        );
    });
}
