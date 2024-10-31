import { assertNotNullOrUndefined } from '@captainpants/sweeter-utilities';
import { type MatcherContext } from './types.js';

export interface MatcherRuleConstraint {
    priority: number;
}

export class Matcher<TRule extends MatcherRuleConstraint, TTypeType> {
    public constructor(
        rules: TRule[],
        match: (
            context: MatcherContext,
            type: TTypeType,
            rule: TRule,
        ) => boolean,
    ) {
        this.rules = rules;
        this.match = match;
    }

    public readonly rules: TRule[];
    public readonly match: (
        context: MatcherContext,
        model: TTypeType,
        rule: TRule,
    ) => boolean;

    public findBestMatch(
        context: MatcherContext,
        type: TTypeType,
    ): TRule | null {
        let bestCandidateRule: TRule | null = null;

        for (let i = this.rules.length - 1; i >= 0; --i) {
            const rule = this.rules[i];
            assertNotNullOrUndefined(rule);

            if (
                (bestCandidateRule === null ||
                    bestCandidateRule.priority < rule.priority) &&
                this.#doesMatch(context, type, rule)
            ) {
                bestCandidateRule = rule;
            }
        }

        return bestCandidateRule;
    }

    public findAllMatches(context: MatcherContext, type: TTypeType): TRule[] {
        const matches: Array<[rule: TRule, index: number]> = [];

        for (let i = this.rules.length - 1; i >= 0; --i) {
            const rule = this.rules[i];
            assertNotNullOrUndefined(rule);

            if (this.#doesMatch(context, type, rule)) {
                matches.push([rule, i]);
            }
        }

        // This is supposed to be stable as of ECMSScript 2019 (According to MDN) but
        // in earlier versions of Chrome it wasn't and we want a reliable sort order
        // so including the index in the sort
        matches.sort(priorityDescendingThenIndexDescending);

        return matches.map(([rule, _index]) => rule);
    }

    #doesMatch(context: MatcherContext, type: TTypeType, rule: TRule): boolean {
        return this.match(context, type, rule);
    }
}

type SortingMatch = [rule: MatcherRuleConstraint, index: number];

function priorityDescendingThenIndexDescending(
    [aRule, aIndex]: SortingMatch,
    [bRule, bIndex]: SortingMatch,
): number {
    // Descending priority value
    if (aRule.priority > bRule.priority) {
        return -1;
    } else if (aRule.priority < bRule.priority) {
        return 1;
    } else {
        // Then in ascending index order
        return bIndex - aIndex;
    }
}
