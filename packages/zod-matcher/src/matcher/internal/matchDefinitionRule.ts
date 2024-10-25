import { descend, deepEqual } from '@captainpants/sweeter-utilities';
import { and, or } from '../../internal/logical.js';
import { type ParentTypeInfo, type TypeInfo } from '../../models/parents.js';
import {
    type MatcherContext,
    type TypeMatcherRule,
    type TypeMatcherRulePart,
} from '../types.js';

function traverseAncestors(
    node: TypeInfo,
    predicate: (node: ParentTypeInfo) => boolean,
): ParentTypeInfo | undefined {
    let current = node.parentInfo;
    while (current !== null) {
        if (predicate(current)) {
            return current;
        }

        current = current.parentInfo;
    }

    return undefined;
}

export function matchDefinitionRule<TResult>(
    context: MatcherContext,
    typeInfo: TypeInfo,
    part: TypeMatcherRule<TResult>,
    depth = descend.defaultDepth,
): boolean {
    return matchDefinitionRulePart(context, typeInfo, part.matches, depth);
}

export function matchDefinitionRulePart(
    context: MatcherContext,
    typeInfo: TypeInfo,
    part: TypeMatcherRulePart,
    depth = descend.defaultDepth,
): boolean {
    let res: boolean;

    switch (part.type) {
        case 'setting':
            res = deepEqual(part.value, context.settings[part.name]);
            break;
        case 'attr':
            res = deepEqual(part.value, typeInfo.type.getAttr(part.name));
            break;
        case 'label':
            res = typeInfo.type.hasLabel(part.label);
            break;
        case 'type':
            res = typeInfo.type.constructor === part.constructor;
            break;
        case 'not':
            res = !matchDefinitionRulePart(
                context,
                typeInfo,
                part.operand,
                descend(depth),
            );
            break;
        case 'or':
            res = or(part.rules, (item) =>
                matchDefinitionRulePart(
                    context,
                    typeInfo,
                    item,
                    descend(depth),
                ),
            );
            break;

        case 'and':
            res = and(part.rules, (item) =>
                matchDefinitionRulePart(
                    context,
                    typeInfo,
                    item,
                    descend(depth),
                ),
            );
            break;

        case 'propertyOf':
            if (typeInfo.parentInfo?.relationship.type !== 'property') {
                res = false;
            } else if (
                // else if there is a propertyName check and it fails
                typeof part.propertyName !== 'undefined' &&
                part.propertyName !== typeInfo.parentInfo.relationship.property
            ) {
                res = false;
            } else {
                res = matchDefinitionRulePart(
                    context,
                    typeInfo.parentInfo,
                    part.match,
                    descend(depth),
                );
            }
            break;

        case 'element':
            if (typeInfo.parentInfo?.relationship.type !== 'element') {
                res = false;
            } else {
                res = matchDefinitionRulePart(
                    context,
                    typeInfo.parentInfo,
                    part.match,
                    descend(depth),
                );
            }
            break;

        case 'ancestor':
            res =
                traverseAncestors(typeInfo, (item) =>
                    matchDefinitionRulePart(
                        context,
                        item,
                        part.match,
                        descend(depth),
                    ),
                ) !== null;
            break;

        case 'callback':
            res = part.callback(typeInfo, context);
            break;

        default:
            throw new Error('Unexpected');
    }

    return res;
}
