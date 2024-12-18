import { AstNodeLocation, RollupAstNode, Plugin as RollupPlugin } from "rollup"

import * as estraverse from 'estraverse';
import MagicString from 'magic-string';
import { traverse, builders as b, is, NodePath } from 'estree-toolkit';
import * as acorn from 'acorn';
import { createFilter } from "@rollup/pluginutils";
import { toSearcher } from "./toSearcher.js";

export interface SweeterRollupPluginOptions {
    include?: string[];
    exclude?: string[];
}

const standardSigils = [
    '$mutable',
    '$derive',
    '$defer'
] as const;

export default function sweeterPlugin({ include, exclude }: SweeterRollupPluginOptions = {}): RollupPlugin {
    const filter = createFilter(include, exclude);

    const sigilizedSignalFunctions = new Set();
    const search = toSearcher([...standardSigils]);

    return {
        name: 'rollup-plugin-sweeter',
        
        transform(code, id) {
            if (!filter(id)) {
                return; // no action
            }
            if (!search(code)) {
                this.warn('Exiting 2');
                return; // doesn't contain any of the sigils (text search)
            }

            // TODO: sourceType: "module" might lock us into something undesirable
            // Are there other settings we need
            // Can we steal rollups implementation that generates options to pass
            // to acorn
            var ast = this.parse(code);
            
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

            // This is useful for logging
            const context = this;
            
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
}

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