import {
    type AmbientValueCallback,
    asUnknown,
    type Model,
    type Replacer,
    type TypeMatcherRule,
} from '@captainpants/typeytypetype';

import { AmbientValues } from './AmbientValues.js';
import { EditorHost } from './EditorHost.js';
import { type EditorComponentType, type EditorSettings } from '../types.js';
import {
    EditorRootContext,
    type EditorRootContextType,
} from '../context/EditorRootContext.js';
import { $calc, $val, type PropertiesMightBeSignals } from '@captainpants/sweeter-core';
import { Button, Modal } from '@captainpants/sweeter-gummybear';
import { standardRules } from '../standardRules.js';

export type EditorRootProps<T> = PropertiesMightBeSignals<{
    model: Model<T>;
    replace: Replacer<T>;
    settings?: EditorSettings;

    idPath?: string;

    getAmbientValue?: (name: string) => unknown;

    rules?: Array<TypeMatcherRule<EditorComponentType>>;
}>

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
    settings,
    idPath,
    getAmbientValue,
    rules: rulesProp,
}: Readonly<EditorRootProps<T>>): JSX.Element {
    const typedModel = $calc(() => asUnknown($val(model)));

    return $calc(() => {
        const hostContext: EditorRootContextType = {
            settings: $val(settings) ?? defaultSettings,
            editButtonComponentType: props => {
                return <Button onclick={props.onClick}>{props.text}</Button>
            },
            modalComponentType: ({ isOpen, onClose, onCommit, title, children }) =>{
                return <Modal isOpen={isOpen} onClose={onClose} title={title} footer={<>
                    <Button variant="primary" outline onclick={onClose}>Cancel</Button>
                    <Button variant="primary" onclick={onCommit}>Ok</Button>
                </>}>{children}</Modal>
            },
            rules: $val(rulesProp) ?? standardRules
        };

        const getAmbientValueResolved = $val(getAmbientValue);

        let newAmbientValuesCallback: AmbientValueCallback | undefined;

        if (getAmbientValueResolved) {
            newAmbientValuesCallback = {
                get: (name: string): unknown => getAmbientValueResolved?.(name),
            };
        }

        // Cheating the type system here a bit (replace as any)
        // we'll need the editors themselves to validate that their models are the right type
        return (
            <AmbientValues callback={newAmbientValuesCallback}>
                {() =>
                    EditorRootContext.invokeWith(hostContext, () => (
                        <EditorHost
                            model={typedModel}
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