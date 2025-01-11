import { is, NodePath } from 'estree-toolkit';
import { Node } from 'estree-toolkit/dist/helpers';

import { assertAstLocation } from './assertAstLocation.js';
import { newlinesBetween } from './newlinesBetween.js';

export function getLocation(
    code: string,
    path: NodePath,
    node: Node,
): [method: string | undefined, row: number, col: number] {
    assertAstLocation(node);

    const funcName = getDeclaringMethodName(path);
    const [row, col] = getRowAndCol(code, node.start);

    return [funcName, row, col];
}

function getRowAndCol(
    code: string,
    offset: number,
): [row: number, col: number] {
    const upToOffset = code.substring(0, offset);
    const startOfLineOffset = upToOffset.lastIndexOf('\n') + 1; // move beyond the newline character and (-1 => 0)

    const row = 1 /* 1-based */ + newlinesBetween(code, 0, offset); // number of lines = number of \n + 1
    const col = 1 /* 1-based */ + (offset - startOfLineOffset);

    return [row, col];
}

function getDeclaringMethodName(path: NodePath): string | undefined {
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

        if (
            is.property(enclosingMethodDeclaration.parent) &&
            enclosingMethodDeclaration.parent.kind === 'init' &&
            is.identifier(enclosingMethodDeclaration.parent.key)
        ) {
            return enclosingMethodDeclaration.parent.key.name;
        }

        return '(anonymous function)';
    }

    return '(not found)';
}
