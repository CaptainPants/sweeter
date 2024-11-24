import { BaseNode, Domain, Intersection, Proto, Union, Unit } from "@ark/schema";

export function getUnitNode(node: BaseNode): Unit.Node | undefined {
    if (node instanceof Unit.Node) return node;
    return undefined;
}

export function getDomainNode(node: BaseNode): Domain.Node | undefined {
    if (node instanceof Domain.Node) return node;
    return undefined;
}

export function getIntersectionNode(node: BaseNode): Intersection.Node | undefined {
    if (node instanceof Intersection.Node) return node;
    return undefined;
}

export function getProtoNode(node: BaseNode): Proto.Node | undefined {
    const proto = (node as { proto?: unknown }).proto;
    if (proto instanceof Proto.Node) return proto;
    return undefined;
}

export function getUnionNode(node: BaseNode): Union.Node | undefined {
    if (node instanceof Union.Node) return node;
    return undefined;
}