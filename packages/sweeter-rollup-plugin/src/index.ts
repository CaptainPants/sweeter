import { defineConfig, PluginOption } from "vite"

import ESTraverse from "estraverse";
import MagicString from 'magic-string';

export default function SweeterRollupPlugin(): PluginOption {
    return {
        name: 'sweeter-rollup-plugin',
        transform(code, id, options) {
            var ast = this.parse(code);
            
            const magicString = new MagicString(code);

            ESTraverse.traverse(
                ast,
                {
                    enter(node, parent) {
                        if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
                            if (node.callee.name === '$mutable') {
                                const endIndex = node.range?.[1];
                                if (endIndex) {
                                    magicString.appendRight(endIndex, '.identify(xxx, yyy, zzz)');
                                }
                            }
                        }
                    },
                }
            ); 

            if (magicString.hasChanged()) {
                const map = magicString.generateMap({
                    source: id,
                    file: id + '.map',
                    includeContent: true
                  })
                return { code: magicString.toString(), map };
            }

            return { code: code };
        }
    };
}
