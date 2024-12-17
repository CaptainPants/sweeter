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
                                const name = getVariableName(path, node.callee.name, next);
                                const funcName = getDeclaringMethod(path);
                                // TODO: id is an absolute path, we would preferrably use a project relative path possibly prefixed with the project name
                                // E.g. @captainpanges/sweeter-core:folder1/file.ts
                                const filename = id; 

                                if (node.range) {
                                    const [, endIndex] = node.range;
                                    magicString.appendRight(endIndex, `.identify(${JSON.stringify(name)}, ${JSON.stringify(funcName)}, ${JSON.stringify(filename)})`);
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