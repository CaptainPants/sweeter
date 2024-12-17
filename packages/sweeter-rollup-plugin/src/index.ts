import { PluginOption } from "vite"

import * as estraverse from 'estraverse';
import MagicString from 'magic-string';
import { traverse, builders as b, is, NodePath } from 'estree-toolkit';
import * as acorn from 'acorn';

const sigilizedSignalFunctions = new Set([
    '$mutable',
    '$derive',
    '$defer'
]);

export interface SweeterRollupPluginOptions {
    include?: string[]; // TODO
    exclude?: string[]; // TODO
}

export default function sweeterRollupPlugin({ include, exclude }: SweeterRollupPluginOptions = {}): PluginOption {
    return {
        name: 'sweeter-rollup-plugin',
        transform(code, id, options) {
            var ast = acorn.parse(code, { ecmaVersion: 'latest', ranges: true, sourceType: "module" });
            
            const magicString = new MagicString(code);

            let counter = 1;
            const next = () => counter++;

            const outerThis = this;
            
            traverse(
                ast,
                {
                    CallExpression(path) {
                        const node = path.node;
                        
                        if (node && is.identifier(node.callee)) {
                            if (sigilizedSignalFunctions.has(node.callee.name)) {
                                const endIndex = node.range?.[1];
                                outerThis.warn('Range: ' + JSON.stringify(node.range));

                                const name = getVariableName(path, node.callee.name, next);
                                const funcName = getDeclaringMethod(path);

                                if (endIndex) {
                                    magicString.appendRight(endIndex, `.identify(${JSON.stringify(name)}, ${JSON.stringify(funcName)}, zzz)`);
                                }
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
}

function getVariableName(path: NodePath, signalType: string, nextCount: (name: string) => number): string | undefined {
    if (is.variableDeclarator(path.parent) && is.identifier(path.parent.id)) {
        return path.parent.id.name;
    }
    else {
        return `${signalType}-${nextCount(signalType)}`;
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