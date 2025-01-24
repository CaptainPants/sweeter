import { type ArgumentMatcher } from '../types.js';

import { RestMatcher } from './RestMatcher.js';
import { SinglePartMatcher } from './SinglePartMatcher.js';

export const match = {
    /**
     * Match a segment of the path up to the next /
     */
    segment: new SinglePartMatcher() as ArgumentMatcher,

    /**
     * Match the rest of the path.
     */
    remaining: new RestMatcher() as ArgumentMatcher,
} as const;

Object.freeze(match);
