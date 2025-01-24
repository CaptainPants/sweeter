import { Node } from 'estree-toolkit/dist/helpers';
import { AstNodeLocation } from 'rollup';

export function assertAstLocation(
    node: Node,
): asserts node is Node & AstNodeLocation {
    const hasProperties =
        typeof (node as Node & AstNodeLocation).start === 'number' &&
        typeof (node as Node & AstNodeLocation).end === 'number';
    if (!hasProperties)
        throw new TypeError('Node did not have start and end property.');
}
