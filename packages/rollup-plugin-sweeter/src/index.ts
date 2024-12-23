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

const standardSigils = [
    '$constant',
    '$controller',
    '$defer',
    '$derive',
    '$elementOf',
    '$lastGood',
    '$mapByIdentity',
    '$mapByIndex',
    '$mutable',
    '$propertyOf',
    '$readonly',
    '$wrap',
] as const;

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
        identifiableSigils: sigils,
    });

    return {
        name: 'rollup-plugin-sweeter',

        transform(code, id) {
            if (!filter(id)) {
                this.info(
                    `Ignoring file as it doesn't match include/exclude filters ${id}`,
                );
                return; // no action
            }
            if (!search(code)) {
                this.info(
                    `Ignoring file as it doesn't contain any sigils ${id}`,
                );
                return; // doesn't contain any of the sigils (text search)
            }
            this.info(`Processing file ${id}`);

            const result = tranform(code, id, this);

            this.info(`Finished processing file ${id}`);

            return result;
        },
    };
}
