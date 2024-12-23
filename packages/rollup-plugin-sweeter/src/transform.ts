import { is, NodePath, traverse } from 'estree-toolkit';
import MagicString from 'magic-string';
import path from 'node:path';
import {
    AstNodeLocation,
    ProgramNode,
    SourceMap,
    TransformPluginContext,
} from 'rollup';
import { assertAstLocation } from './assertAstLocation';
import { getLocation } from './getLocation';
import { constants } from './constants';

export type Transformer = (
    code: string,
    id: string,
    context: TransformPluginContext,
) => { code: string; map: SourceMap; ast: ProgramNode };

export interface TransformSetup {
    identifiableSigils: readonly string[];
    roots: readonly string[];
    projectName: string;
}

export function createTransform({
    identifiableSigils,
    roots: rawRoots,
    projectName,
}: TransformSetup) {
    const identifiableFunctions = new Set(identifiableSigils);

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
                    if (identifiableFunctions.has(path.node.callee.name)) {
                        const ignore = shouldIgnore(path);
                        if (ignore) {
                            magicString.remove(...ignore);
                        } else {
                            const name = getVariableName(
                                path,
                                path.node.callee.name,
                                next,
                            );
                            const [funcName, row, col] = getLocation(
                                code,
                                path,
                                path.node,
                            );

                            magicString.appendRight(
                                path.node.end,
                                `./* rollup-plugin-sweeter: */${constants.identify}(${JSON.stringify(name)}, ${JSON.stringify(filename)}, ${JSON.stringify(funcName)}, ${row}, ${col})`,
                            );
                        }
                    } else if (
                        path.node.callee.name == constants.insertLocation
                    ) {
                        const location = getLocation(code, path, path.node);
                        const toInject = [filename, ...location];

                        magicString.update(
                            path.node.start,
                            path.node.end,
                            '/* rollup-plugin-sweeter: */' +
                                JSON.stringify(toInject),
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

function shouldIgnore(
    pathOfSigilCall: NodePath,
): undefined | [start: number, end: number] {
    // $mutable(1).doNotIdentify()
    // in this case the pathOfSigilCall is $mutable(1)
    // where the callee would be a MemberExpression inside
    // a CallExpression

    const memberExpression = pathOfSigilCall.parentPath;
    if (!memberExpression || !is.memberExpression(memberExpression.node)) {
        return undefined;
    }

    if (
        !is.identifier(memberExpression.node.property) ||
        memberExpression.node.property.name !== constants.doNotIdentify
    ) {
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
