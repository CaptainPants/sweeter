import { createFilter } from '@rollup/pluginutils';
import { Plugin as RollupPlugin } from 'rollup';

import { toSearcher } from '../utility/implementation/toSearcher.js';

import { createTransform } from './implementation/transform.js';

export interface SweeterRollupPluginOptions {
    include?: readonly string[];
    exclude?: readonly string[];
    sigils?: readonly string[];
    roots?: readonly string[];
    projectName: string;
    debugMatching?: RegExp;
}

const standardSigils = [
    '$constant',
    '$controller',
    '$deferred',
    '$derived',
    '$filtered',
    '$elementOf',
    '$lastGood',
    '$mapByIdentity',
    '$mapByIndex',
    '$mutable',
    '$propertyOf',
    '$readonly',
    '$wrap',
    '$mapByIdentity',
    '$mapByIndex',
] as const;

function sweeterPlugin({
    include,
    exclude,
    sigils,
    roots,
    projectName,
    debugMatching,
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

        async transform(code, id) {
            if (!filter(id)) {
                // this.info(
                //     `Ignoring file as it doesn't match include/exclude filters ${id}`,
                // );
                return; // no action
            }
            if (!search(code)) {
                // this.info(
                //     `Ignoring file as it doesn't contain any sigils ${id}`,
                // );
                return; // doesn't contain any of the sigils (text search)
            }

            const debugLogging = debugMatching
                ? !!id.match(debugMatching)
                : false;
            const log = debugLogging
                ? (message: string) => this.info(message)
                : () => void 0;

            log(`Processing file`);

            const result = await tranform(code, id, this, log);

            log(`Finished processing file`);

            return result;
        },
    };
}

export default sweeterPlugin;
export { sweeterPlugin };
