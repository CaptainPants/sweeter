import { is, NodePath, traverse } from 'estree-toolkit';
import MagicString from 'magic-string';
import path from 'node:path';
import {
    AstNodeLocation,
    ProgramNode,
    SourceMap,
    TransformPluginContext,
} from 'rollup';

export type Transformer = (
    code: string,
    id: string,
    context: TransformPluginContext,
) => { code: string; map: SourceMap; ast: ProgramNode };

export interface TransformSetup {
    sigils: readonly string[];
    roots: readonly string[];
    projectName: string;
}

export function createTransform({
    sigils,
    roots: rawRoots,
    projectName,
}: TransformSetup) {
    const sigilizedSignalFunctions = new Set(sigils);

    const roots = rawRoots.map((x) =>
        path.isAbsolute(x) ? x : path.resolve(x),
    );

    return (
        code: string,
        id: string,
        context: TransformPluginContext,
    ): { code: string; map: SourceMap } | undefined => {
        const ast = context.parse(code);
        const magicString = new MagicString(code);

        // This is used for assigning incremental identifiers when the signal
        // doesn't have an obvious name.
        const counters = new Map<string, number>();
        const next = (sigil: string) => {
            const found = counters.get(sigil);
            if (found !== undefined) {
                const next = found + 1;
                counters.set(sigil, next);
                return next;
            } else {
                counters.set(sigil, 1);
                return 1;
            }
        };

        const filename = getUsefulFilenameFromId(id, roots, projectName + ':');

        traverse(ast, {
            CallExpression(path) {
                const node = path.node as typeof path.node & AstNodeLocation;

                if (node && is.identifier(node.callee)) {
                    if (sigilizedSignalFunctions.has(node.callee.name)) {
                        const name = getVariableName(
                            path,
                            node.callee.name,
                            next,
                        );
                        const funcName = getDeclaringMethod(path);
                        const [row, col] = getRowAndCol(code, node.start);

                        magicString.appendRight(
                            node.end,
                            `.identify(${JSON.stringify(name)}, ${JSON.stringify(funcName)}, ${JSON.stringify(filename)}, ${row}, ${col})`,
                        );
                    }
                }
            },
        });

        if (magicString.hasChanged()) {
            const map = magicString.generateMap({
                source: id,
                file: id + '.map',
                includeContent: true,
            });
            return { code: magicString.toString(), map };
        }

        return;
    };
}

function getVariableName(
    path: NodePath,
    sigil: string,
    nextCount: (name: string) => number,
): string | undefined {
    if (is.variableDeclarator(path.parent) && is.identifier(path.parent.id)) {
        return path.parent.id.name;
    } else {
        return `${sigil}-${nextCount(sigil)}`;
    }
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

function getUsefulFilenameFromId(
    id: string,
    resolvedRoots: readonly string[],
    prefix: string,
) {
    let filePath = path.normalize(id);

    let matched = false;

    for (const root of resolvedRoots) {
        if (filePath.startsWith(root + path.sep)) {
            matched = true;
            // remove matched root prefix
            filePath = filePath.substring(root.length + 1);
        }
    }

    if (!matched) {
        // <unknown>/<filenameOnly>
        filePath = '<unknown>/' + path.basename(filePath);
    }

    return prefix + filePath;
}

function getRowAndCol(
    code: string,
    offset: number,
): [row: number, col: number] {
    const upToOffset = code.substring(0, offset);

    const row = upToOffset.split('\n').length; // number of lines = number of \n + 1

    let startOfLine = upToOffset.lastIndexOf('\n') + 1; // move beyond the newline character and (-1 => 0)

    const col = offset - startOfLine;

    return [row, col + 1 /* 1-based */];
}
