import { is, NodePath } from 'estree-toolkit';
import { newlinesBetween } from './newlinesBetween';
import { assertAstLocation } from './assertAstLocation';
import { Node } from 'estree-toolkit/dist/helpers';

export function getLocation(
    code: string,
    path: NodePath,
    node: Node,
): [method: string | undefined, row: number, col: number] {
    assertAstLocation(node);

    const funcName = getDeclaringMethod(path);
    const [row, col] = getRowAndCol(code, node.start);

    return [funcName, row, col];
}

function getRowAndCol(
    code: string,
    offset: number,
): [row: number, col: number] {
    const upToOffset = code.substring(0, offset);

    const row = newlinesBetween(code, 0, offset); // number of lines = number of \n + 1

    let startOfLine = upToOffset.lastIndexOf('\n') + 1; // move beyond the newline character and (-1 => 0)

    const col = offset - startOfLine;

    return [row, col + 1 /* 1-based */];
}

function getDeclaringMethod(path: NodePath): string | undefined {
    const enclosingMethodDeclaration = path.findParent(
        (x) =>
            is.functionDeclaration(x.node) ||
            is.functionExpression(x.node) ||
            is.arrowFunctionExpression(x.node),
    );

    if (!enclosingMethodDeclaration?.node) {
        return '(top level)';
    }

    if (is.functionDeclaration(enclosingMethodDeclaration.node)) {
        return enclosingMethodDeclaration.node.id.name;
    }
    if (
        is.functionExpression(enclosingMethodDeclaration.node) ||
        is.arrowFunctionExpression(enclosingMethodDeclaration.node)
    ) {
        if (
            is.variableDeclarator(enclosingMethodDeclaration.parent) &&
            is.identifier(enclosingMethodDeclaration.parent.id)
        ) {
            return enclosingMethodDeclaration.parent.id.name;
        }

        return '(anonymous function)';
    }

    return '(not found)';
}
