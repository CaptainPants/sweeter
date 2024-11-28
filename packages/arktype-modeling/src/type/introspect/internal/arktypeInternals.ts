import {
    type BaseNode,
    Domain,
    Intersection,
    Union,
    Unit,
} from '@ark/schema';

export function asUnitNode(node: BaseNode): Unit.Node | undefined {
    if (node instanceof Unit.Node) return node;
    return undefined;
}

export function asDomainNode(node: BaseNode): Domain.Node | undefined {
    if (node instanceof Domain.Node) return node;
    return undefined;
}

export function asIntersectionNode(
    node: BaseNode,
): Intersection.Node | undefined {
    if (node instanceof Intersection.Node) return node;
    return undefined;
}

export function asUnionNode(node: BaseNode): Union.Node | undefined {
    if (node instanceof Union.Node) return node;
    return undefined;
}
