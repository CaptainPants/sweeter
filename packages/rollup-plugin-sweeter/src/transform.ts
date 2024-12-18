import { is, NodePath, traverse } from "estree-toolkit";
import MagicString from "magic-string";
import { AstNodeLocation, ProgramNode, SourceMap, TransformPluginContext } from "rollup";

export type Transformer = (code: string, id: string, context: TransformPluginContext) => { code: string, map: SourceMap, ast: ProgramNode };

export function createTransform(sigils: readonly string[]) {
    const sigilizedSignalFunctions = new Set(sigils);

    return (code: string, id: string, context: TransformPluginContext): { code: string, map: SourceMap } | undefined => {
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
            }
            else {
                counters.set(sigil, 1);
                return 1;
            }

        };
        
        traverse(
            ast,
            {
                CallExpression(path) {
                    const node = path.node as typeof path.node & AstNodeLocation;
                    
                    if (node && is.identifier(node.callee)) {
                        if (sigilizedSignalFunctions.has(node.callee.name)) {
                            const name = getVariableName(path, node.callee.name, next);
                            const funcName = getDeclaringMethod(path);
                            // TODO: id is an absolute path, we would preferrably use a project relative path possibly prefixed with the project name
                            // E.g. @captainpants/sweeter-core:folder1/file.ts
                            const filename = id; 

                            magicString.appendRight(node.end, `.identify(${JSON.stringify(name)}, ${JSON.stringify(funcName)}, ${JSON.stringify(filename)})`);
                        }
                    }
                }
            }
        ); 

        if (magicString.hasChanged()) {
            const map = magicString.generateMap({
                source: id,
                file: id + '.map',
                includeContent: true,
            });
            return { code: magicString.toString(), map };
        }

        return;
    }
};

function getVariableName(path: NodePath, sigil: string, nextCount: (name: string) => number): string | undefined {
    if (is.variableDeclarator(path.parent) && is.identifier(path.parent.id)) {
        return path.parent.id.name;
    }
    else {
        return `${sigil}-${nextCount(sigil)}`;
    }
}

function getDeclaringMethod(path: NodePath): string | undefined {
    const enclosingMethodDeclaration = path.findParent(x => is.functionDeclaration(x.node) || is.functionExpression(x.node) || is.arrowFunctionExpression(x.node));

    if (!enclosingMethodDeclaration?.node) {
        return "(top level)";
    }

    if (is.functionDeclaration(enclosingMethodDeclaration.node)) {
        return enclosingMethodDeclaration.node.id.name;
    }
    if (is.functionExpression(enclosingMethodDeclaration.node) || is.arrowFunctionExpression(enclosingMethodDeclaration.node)) {
        if (is.variableDeclarator(enclosingMethodDeclaration.parent) && is.identifier(enclosingMethodDeclaration.parent.id)) {
            return enclosingMethodDeclaration.parent.id.name;
        }

        return "(anonymous function)";
    }
    
    return "(not found)";
}