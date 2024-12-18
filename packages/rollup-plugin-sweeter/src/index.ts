import { Plugin as RollupPlugin } from 'rollup';

import { createFilter } from '@rollup/pluginutils';
import { toSearcher } from './toSearcher.js';
import { createTransform } from './transform.js';

export interface SweeterRollupPluginOptions {
    include?: readonly string[];
    exclude?: readonly string[];
    sigils?: readonly string[];
    roots?: readonly string[];
    projectName: string;
}

const standardSigils = ['$mutable', '$derive', '$defer'] as const;

export default function sweeterPlugin({
    include,
    exclude,
    sigils,
    roots,
    projectName,
}: SweeterRollupPluginOptions): RollupPlugin {
    const filter = createFilter(include, exclude);

    sigils ??= standardSigils;
    const search = toSearcher([...standardSigils]);
    const tranform = createTransform({
        roots: roots ?? [],
        projectName,
        sigils,
    });

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

            return tranform(code, id, this);
        },
    };
}
