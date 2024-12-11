import {
    Rules,
    type TypeMatcherRule,
    type TypeMatcherRulePart,
    introspect,
} from '@captainpants/sweeter-arktype-modeling';
import { type EditorComponentType } from './types.js';
import { ModalEditorIfTooSmall } from './editors/ModalEditorIfTooSmall.js';

export interface DefaultRulesSetOptions {
    object?: EditorComponentType;
    string?: EditorComponentType;
    number?: EditorComponentType;
    boolean?: EditorComponentType;
    array?: EditorComponentType;
    constantUnion?: EditorComponentType;
    union?: EditorComponentType;
    constant?: EditorComponentType;
}

function addIfPresent(
    array: Array<TypeMatcherRule<EditorComponentType>>,
    matches: TypeMatcherRulePart,
    component?: EditorComponentType | undefined,
): void {
    if (component) {
        array.push({
            matches,
            result: component,
            priority: 0,
        });
    }
}

/**
 * Create a rule set with the default editor types in the default order, including a modal editor to handle object editors that don't have enough space.
 * @param options
 * @returns
 */
export function createDefaultRulesSet(
    options: DefaultRulesSetOptions,
): Array<TypeMatcherRule<EditorComponentType>> {
    const result: Array<TypeMatcherRule<EditorComponentType>> = [];
    addIfPresent(result, Rules.object(), options.object);
    addIfPresent(result, Rules.string(), options.string);
    addIfPresent(result, Rules.number(), options.number);
    addIfPresent(result, Rules.array(), options.array);

    // union variants: boolean (as a switch), union of only constants (show as a dropdown) or any other union
    // in reverse priority order (the latest match is used)
    addIfPresent(result, Rules.union(), options.union);
    addIfPresent(
        result,
        Rules.callback(
            ({ type }) =>
                introspect
                    .tryGetUnionTypeInfo(type)
                    ?.branches.every((member) =>
                        introspect.isLiteralType(member),
                    ) ?? false,
        ),
        options.constantUnion,
    );
    addIfPresent(
        result,
        Rules.callback(({ type }) => introspect.isBooleanType(type)),
        options.boolean,
    );

    addIfPresent(
        result,
        Rules.callback(({ type }) => introspect.isLiteralType(type)),
        options.constant,
    );

    // wrap in a modal
    result.push({
        matches: Rules.or([Rules.object()]),
        result: (props) => <ModalEditorIfTooSmall {...props} minWidth={240} />,
        priority: 10,
    });

    result.push({
        matches: Rules.array(),
        result: (props) => <ModalEditorIfTooSmall {...props} minWidth={140} />,
        priority: 10,
    });

    return result;
}
