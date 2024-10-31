import { type TypeInfo } from '../models/parents.js';

export type SelectorStep =
    | {
          $element: TypeMatcherRulePart | TypeMatcherRulePart[];
      }
    | {
          $property: TypeMatcherRulePart | TypeMatcherRulePart[];
          propertyName?: string | undefined;
      }
    | {
          $descendent: TypeMatcherRulePart | TypeMatcherRulePart[];
      };

export type Selector = [top: TypeMatcherRulePart, ...rest: SelectorStep[]];

export type TypeMatcherRulePart =
    | {
          type: 'any';
      }
    | {
          type: 'instanceOf';
          constructor: new (...args: any[]) => any;
      }
    | {
          type: 'label';
          label: string;
      }
    | {
          type: 'attr';
          name: string;
          value: unknown;
      }
    | {
          type: 'setting';
          name: string;
          value: unknown;
      }
    | {
          type: 'element';
          match: TypeMatcherRulePart;
      }
    | {
          type: 'propertyOf';
          propertyName?: string | undefined;
          match: TypeMatcherRulePart;
      }
    | {
          type: 'ancestor';
          match: TypeMatcherRulePart;
      }
    | {
          type: 'not';
          operand: TypeMatcherRulePart;
      }
    | {
          type: 'or';
          rules: TypeMatcherRulePart[];
      }
    | {
          type: 'and';
          rules: TypeMatcherRulePart[];
      }
    | {
          type: 'callback';
          callback: (type: TypeInfo, context: MatcherContext) => boolean;
      };

export interface TypeMatcherRule<TResult> {
    name?: string;
    matches: TypeMatcherRulePart;
    priority: number;
    result: TResult;
}

export interface MatcherContext {
    settings: Record<string, unknown>;
}
