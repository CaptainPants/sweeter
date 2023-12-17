import { type TypeInfo } from '../models/parents.js';

import { matchDefinitionRule } from './internal/matchDefinitionRule.js';
import { Matcher } from './Matcher.js';
import { type TypeMatcherRule } from './types.js';

export function createTypeMatcher<TResult>(
    rules: Array<TypeMatcherRule<TResult>>,
): Matcher<TypeMatcherRule<TResult>, TypeInfo> {
    return new Matcher<TypeMatcherRule<TResult>, TypeInfo>(
        rules,
        matchDefinitionRule,
    );
}
