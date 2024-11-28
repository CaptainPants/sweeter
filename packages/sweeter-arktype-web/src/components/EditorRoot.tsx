import {
    type AmbientValueCallback,
    type AnyTypeConstraint,
    asUnknown,
    type Model,
    type Replacer,
    type TypeMatcherRule,
    type UnknownReplacer,
} from '@captainpants/arktype-modeling';

import { AmbientValues } from './AmbientValues.js';
import { EditorHost } from './EditorHost.js';
import { type EditorComponentType, type EditorSettings } from '../types.js';
import {
    EditorRootContext,
    type EditorRootContextType,
} from '../context/EditorRootContext.js';
import {
    $calc,
    $val,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { Button, Modal } from '@captainpants/sweeter-gummybear';
import { standardRules } from '../standardRules.js';

export type EditorRootProps<TArkType extends AnyTypeConstraint> =
    PropertiesMightBeSignals<{
        id?: string | undefined;
        model: Model<TArkType>;
        replace: Replacer<TArkType>;
        settings?: EditorSettings;

        idPath?: string;

        getAmbientValue?: (name: string) => unknown;

        rules?: Array<TypeMatcherRule<EditorComponentType>>;
    }>;

/**
 * Constant default settings so that the default value doesn't cause constant re-renders from updating the context value.
 */
const defaultSettings = Object.freeze({});

/**
 * The main entry point for an editor structure.
 * @param props
 */
export function EditorRoot<TArkType extends AnyTypeConstraint>(
    props: Readonly<EditorRootProps<TArkType>>,
): JSX.Element;
export function EditorRoot<TArkType extends AnyTypeConstraint>({
    id,
    model,
    replace,
    settings,
    idPath,
    getAmbientValue,
    rules: rulesProp,
}: Readonly<EditorRootProps<TArkType>>): JSX.Element {
    const typedModel = $calc(() => {
        const val = $val(model);
        const result = asUnknown(val);
        return result;
    });

    const newAmbientValuesCallback = $calc(() => {
        const getAmbientValueResolved = $val(getAmbientValue);

        let newAmbientValuesCallback: AmbientValueCallback | undefined;

        if (getAmbientValueResolved) {
            newAmbientValuesCallback = {
                get: (name: string): unknown => getAmbientValueResolved?.(name),
            };
        }

        return newAmbientValuesCallback;
    });

    return $calc(() => {
        const hostContext: EditorRootContextType = {
            settings: $val(settings) ?? defaultSettings,
            Modal: ({
                isOpen,
                onClose,
                commitEnabled,
                onCommit,
                title,
                children,
            }) => {
                return (
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        title={title}
                        footer={
                            <>
                                <Button
                                    variant="primary"
                                    outline
                                    onclick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onclick={onCommit}
                                    disabled={$calc(() => !$val(commitEnabled))}
                                >
                                    Ok
                                </Button>
                            </>
                        }
                    >
                        {children}
                    </Modal>
                );
            },
            rules: $val(rulesProp) ?? standardRules,
        };

        // Cheating the type system here a bit (replace as any)
        // we'll need the editors themselves to validate that their models are the right type
        return (
            <AmbientValues callback={newAmbientValuesCallback}>
                {() =>
                    EditorRootContext.invokeWith(hostContext, () => (
                        <EditorHost
                            id={id}
                            model={typedModel}
                            replace={replace as unknown as UnknownReplacer}
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
