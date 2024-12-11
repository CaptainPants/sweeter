import {
    type UnknownPropertyModel,
    type ContextualValueCalculationContext,
    type UnknownModel,
    UnknownObjectModel,
} from '@captainpants/arktype-modeling';
import {
    LocalizerHook,
    type ComponentInit,
    type PropertiesMightBeSignals,
    $calc,
    $val,
    $peek,
    $subscribe,
} from '@captainpants/sweeter-core';

import { SetupContextualValueCallbacksHook } from '../hooks/SetupContextualValueCallbacksHook.js';
import { AmbientValues } from '../components/AmbientValues.js';
import { EditorHost } from '../components/EditorHost.js';
import { $wrap } from '@captainpants/sweeter-core';
import { idPaths } from '@captainpants/sweeter-utilities';

export type KnownPropertyEditorPartProps = PropertiesMightBeSignals<{
    id: string;

    owner: UnknownObjectModel;
    property: string | symbol;
    value: UnknownModel;
    updateValue: (
        property: string | symbol,
        value: UnknownModel,
    ) => Promise<void>;

    indent: number;
    ownerIdPath: string | undefined;
}>;

export function KnownPropertyEditorPart(
    {
        owner,
        id,
        property,
        value,
        updateValue,
        indent,
        ownerIdPath,
    }: KnownPropertyEditorPartProps,
    init: ComponentInit,
): JSX.Element {
    const idPath = $calc(() => {
        return idPaths.key($val(ownerIdPath), String(property));
    });

    const replace = async (value: UnknownModel) => {
        await $peek(updateValue)($peek(property), value);
    };

    const { localize } = init.hook(LocalizerHook);

    const calculateLocal = $calc(() => {
        return (name: string, context: ContextualValueCalculationContext) =>
            $val(value).type
                .annotations()
                ?.getAssociatedValue(name, $val(owner), context);
    });

    const calculateAmbient = $calc(() => {
        const propertyModelResolved = $val(value);
        $subscribe(owner);

        return (name: string, context: ContextualValueCalculationContext) =>
            $val(value).type
                .annotations()
                ?.getAmbientValue(name, propertyModelResolved.value, context);
    });

    const { local, ambient } = init.hook(
        SetupContextualValueCallbacksHook,
        calculateLocal,
        calculateAmbient,
    );

    const valueModel = $calc(() => $val(value));
    const displayName = $calc(
        () =>
            $val(value).type.annotations()?.displayName() ??
            String($val(property)),
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
