import { type ArgumentMatcher } from '../types.js';
import { RestMatcher } from './RestMatcher.js';
import { SinglePartMatcher } from './SinglePartMatcher.js';

export const match = {
    part: new SinglePartMatcher() as ArgumentMatcher,
    rest: new RestMatcher() as ArgumentMatcher,
} as const;

Object.freeze(match);
