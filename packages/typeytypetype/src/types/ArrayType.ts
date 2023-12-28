import { descend } from '@captainpants/sweeter-utilities';
import { combineTypeDefinitionPath } from '../internal/combineTypeDefinitionPath.js';
import {
    type ValidationOptions,
    type ValidationSingleResult,
} from '../validation/types.js';

import { BaseType } from './BaseType.js';
import { type Type } from './Type.js';

export class ArrayType<TElement> extends BaseType<TElement[]> {
    public constructor(elementType: Type<TElement>) {
        super();
        this.#elementType = elementType;
    }

    #elementType: Type<TElement>;

    public override doMatches(
        value: unknown,
        deep: boolean,
        depth: number,
    ): value is TElement[] {
        if (!Array.isArray(value)) return false;

        if (!deep) {
            return true;
        }

        // Any item doesn't validate against #itemModel
        return (
            value.findIndex(
                (itemValue: unknown) =>
                    !this.#elementType.doMatches(
                        itemValue,
                        deep,
                        descend(depth),
                    ),
            ) < 0
        );
    }

    public override toTypeString(depth: number = descend.defaultDepth): string {
        return `Array<${this.#elementType.toTypeString(descend(depth))}>`;
    }

    public get elementType(): Type<TElement> {
        return this.#elementType;
    }

    protected override async validateChildren(
        value: TElement[],
        options: ValidationOptions,
        depth: number,
    ): Promise<ValidationSingleResult[] | undefined> {
        const res: ValidationSingleResult[] = [];

        for (let i = 0; i < value.length; ++i) {
            const item = value[i];

            const itemResult = await this.#elementType.validate(
                item,
                options,
                descend(depth),
            );

            if (!itemResult.success) {
                res.push(
                    ...itemResult.error.map((item) => ({
                        path: combineTypeDefinitionPath(i, item.idPath),
                        message: item.message,
                    })),
                );
            }
        }

        return res;
    }

    public override doCreateDefault(depth: number): TElement[] {
        return [];
    }
}
