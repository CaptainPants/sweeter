
import { Rules, TypeMatcherRule, TypeMatcherRulePart, isBooleanType, isConstantType, isUnionType } from '@captainpants/zod-matcher';
import { ModalEditorIfTooSmall } from './editors/index.js';
import { type EditorComponentType } from './types.js';

export interface DefaultRulesSetOptions {
    rigidObject?: EditorComponentType;
    mapObject?: EditorComponentType;
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
    component?: EditorComponentType,
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
    addIfPresent(result, Rules.type(RigidObjectType), options.rigidObject);
    addIfPresent(result, Rules.type(MapObjectType), options.mapObject);
    addIfPresent(result, Rules.type(StringType), options.string);
    addIfPresent(result, Rules.type(NumberType), options.number);
    addIfPresent(result, Rules.type(ArrayType), options.array);

    // union variants: boolean (as a switch), union of only constants (show as a dropdown) or any other union
    // in reverse priority order (the latest match is used)
    addIfPresent(result, Rules.type(UnionType), options.union);
    addIfPresent(
        result,
        Rules.callback(
            ({ type }) =>
                isUnionType(type) &&
                type.types.every((member) => isConstantType(member)),
        ),
        options.constantUnion,
    );
    addIfPresent(
        result,
        Rules.callback(({ type }) => isBooleanType(type)),
        options.boolean,
    );

    addIfPresent(
        result,
        Rules.callback(({ type }) => isConstantType(type)),
        options.constant,
    );

    // wrap in a modal
    result.push({
        matches: Rules.or([
            Rules.type(RigidObjectType),
            Rules.type(MapObjectType),
        ]),
        result: (props) => <ModalEditorIfTooSmall {...props} minWidth={240} />,
        priority: 10,
    });

    result.push({
        matches: Rules.type(ArrayType),
        result: (props) => <ModalEditorIfTooSmall {...props} minWidth={140} />,
        priority: 10,
    });

    return result;
}
