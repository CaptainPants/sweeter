import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';

export function depthFirstSearch<TNode>(
    nodes: Iterable<TNode>,
    getChildren: (node: TNode) => Iterable<TNode> | undefined,
    callback: (node: TNode) => boolean | undefined,
): void {
    const stack: TNode[] = [];

    for (const item of reversed(nodes)) {
        stack.push(item);
    }

    while (stack.length > 0) {
        const current = stack.pop();

        assertNotNullOrUndefined(current);

        const callBackResult = callback(current);
        if (callBackResult === true) {
            return;
        }

        // ideally this would be isUnionType but that causes circular import warnings
        const children = getChildren(current);
        if (children) {
            for (const inner of reversed(children)) {
                stack.push(inner);
            }
        }
    }
}

function reversed<T>(iterable: Iterable<T>): T[] {
    return (
        Array.isArray(iterable) ? iterable.slice() : Array.from(iterable)
    ).reverse();
}
