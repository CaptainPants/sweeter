import { is, NodePath, traverse } from 'estree-toolkit';
import MagicString from 'magic-string';
import path from 'node:path';
import {
    AstNodeLocation,
    ProgramNode,
    SourceMap,
    TransformPluginContext,
} from 'rollup';
import { newlinesBetween } from './newlinesBetween';
import { getRowAndCol } from './getRowAndCol';
import { Node } from 'estree-toolkit/dist/helpers';

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
                if (!path.node) {
                    return;
                }
                assertAstLocation(path.node);

                if (is.identifier(path.node.callee)) {
                    if (sigilizedSignalFunctions.has(path.node.callee.name)) {
                        const ignore = shouldIgnore(path);
                        if (ignore) {
                            magicString.remove(...ignore);
                        }
                        else {
                            const name = getVariableName(
                                path,
                                path.node.callee.name,
                                next,
                            );
                            const funcName = getDeclaringMethod(path);
                            const [row, col] = getRowAndCol(code, path.node.start);
    
                            magicString.appendRight(
                                path.node.end,
                                `.identify(${JSON.stringify(name)}, ${JSON.stringify(funcName)}, ${JSON.stringify(filename)}, ${row}, ${col})`,
                            );
                        }
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

function assertAstLocation(node: Node): asserts node is Node & AstNodeLocation {
    const hasProperties = typeof (node as Node & AstNodeLocation).start === 'number' && typeof (node as Node & AstNodeLocation).end === 'number'
    if (!hasProperties) throw new TypeError('Node did not have start and end property.');
}

function shouldIgnore(pathOfSigilCall: NodePath): undefined | [start: number, end: number] {
    // $mutable(1).doNotIdentify()
    // in this case the pathOfSigilCall is $mutable(1)
    // where the callee would be a MemberExpression inside 
    // a CallExpression
    
    const memberExpression = pathOfSigilCall.parentPath;
    if (!memberExpression || !is.memberExpression(memberExpression.node)) {
        return undefined;
    }

    if (!is.identifier(memberExpression.node.property) || memberExpression.node.property.name !== 'doNotIdentify') {
        return undefined;
    }

    const callExpression = memberExpression.parentPath;
    if (!callExpression || !is.callExpression(callExpression.node)) {
        return undefined;
    }

    // parent exists and is a MemberExpression
    // the member property is an identify with name 'doNotIdentify'
    // the next parent is a call expression
    // So we should be matching $sigil().doNotIdentify()

    assertAstLocation(memberExpression.node.object);
    assertAstLocation(callExpression.node);

    return [memberExpression.node.object.end, callExpression.node.end];
}
