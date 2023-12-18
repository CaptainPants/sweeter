import { combineTypeDefinitionPath } from '../internal/combineTypeDefinitionPath.js';
import { depthFirstSearch } from '../internal/depthFirstSearch.js';
import { descend } from '../utility/descend.js';
import {
    type ValidationOptions,
    type ValidationSingleResult,
} from '../validation/types.js';

import { BaseType } from './BaseType.js';
import { type SpreadUnionType } from './internal/types.js';
import { type Type } from './Type.js';

export class UnionType<TUnion> extends BaseType<TUnion> {
    public constructor(types: Array<SpreadUnionType<TUnion>>) {
        super();

        this.types = types;
    }

    public readonly types: ReadonlyArray<SpreadUnionType<TUnion>>;

    /**
     * This will search only direct child types, of which any could be a union. This must be unknown because we can't split apart possible nested unions.
     * @param value
     * @returns
     */
    public findTypeForValue(value: unknown): Type<unknown> | null {
        return this.types.find((x) => x.matches(value)) ?? null;
    }

    /**
     * In the case of nested unions, this will search for the first matching non-union type
     * @param value
     * @returns
     */
    public findTypeForValueRecursive(
        value: unknown,
    ): SpreadUnionType<TUnion> | null {
        let result: Type<unknown> | null = null;

        depthFirstSearch<Type<unknown>>(
            this.types,
            (type) => (type instanceof UnionType ? type.types : undefined),
            (type) => {
                if (type.matches(value)) {
                    result = type;
                    return true; // found! stops searching
                }
                return false;
            },
        );

        return result;
    }

    public getTypeIndexForValue(value: TUnion): number {
        const match = this.types.findIndex((x) => x.matches(value));
        return match;
    }

    public override doMatches(
        value: unknown,
        deep: boolean,
        depth: number,
    ): value is TUnion {
        return (
            this.types.findIndex((model) =>
                model.doMatches(value, deep, descend(depth)),
            ) >= 0
        );
    }

    public override toTypeString(depth: number = descend.defaultDepth): string {
        return this.types
            .map((item) => `(${item.toTypeString(descend(depth))}})`)
            .join(' | ');
    }

    protected override async validateChildren(
        value: TUnion,
        options: ValidationOptions,
        depth: number,
    ): Promise<ValidationSingleResult[] | undefined> {
        const def = this.findTypeForValue(value);

        const result = await def?.validate(value, options, descend(depth));

        if (result && !result.success) {
            return result.error.map((item) => ({
                path: combineTypeDefinitionPath('|', item.idPath),
                message: item.message,
            }));
        }

        return undefined;
    }

    public override doCreateDefault(depth: number): TUnion {
        const type = this.types[0];
        if (type === undefined) {
            throw new TypeError('Union had no type options.');
        }
        return type.createDefault(descend(depth));
    }

    public forEachType(callback: (type: Type<unknown>) => boolean): void {
        depthFirstSearch<Type<unknown>>(
            this.types,
            (node) => (node instanceof UnionType ? node.types : undefined),
            (node) => {
                if (!(node instanceof UnionType)) {
                    callback(node);
                }
                return false;
            },
        );
    }
}
