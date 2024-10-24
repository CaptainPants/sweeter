import { descend } from '@captainpants/sweeter-utilities';
import {
    SpreadModel,
    type Model,
    type UnionModel,
    UnknownModel,
} from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';
import { z } from 'zod';
import { zodUtilityTypes } from '../../utility/zodUtilityTypes.js';

function findTypeForValue<TUnion extends [z.ZodTypeAny, ...z.ZodTypeAny[]]>(
    value: unknown,
    type: z.ZodUnion<TUnion>,
): TUnion[number] | null {
    for (const item of type.options) {
        if (item.safeParse(item).success) return item;
    }
    return null;
}

export class UnionModelImpl<TZodUnionType extends z.ZodUnion<any>>
    extends ModelImpl<z.infer<TZodUnionType>, TZodUnionType>
    implements UnionModel<TZodUnionType>
{
    public static createFromValue<TZodUnionType extends z.ZodUnion<any>>(
        value: z.infer<TZodUnionType>,
        type: TZodUnionType,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): UnionModelImpl<TZodUnionType> {
        const match = findTypeForValue(value, type);

        if (match === null) {
            throw new Error(`Could not find matching type for value.`);
        }

        const resolvedModel = ModelFactory.createUnvalidatedModelPart<
            zodUtilityTypes.UnionOptions<TZodUnionType>
        >({
            value,
            type: match,
            parentInfo,
            depth: descend(depth),
        }) as unknown as SpreadModel<
            zodUtilityTypes.UnionOptions<TZodUnionType>
        >;

        return new UnionModelImpl<TZodUnionType>(
            resolvedModel,
            type,
            parentInfo,
        );
    }

    public constructor(
        resolvedModel: SpreadModel<zodUtilityTypes.UnionOptions<TZodUnionType>>,
        type: TZodUnionType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(resolvedModel.value, type, parentInfo, 'union');

        this.#resolvedModel = resolvedModel;
    }

    #resolvedModel: SpreadModel<zodUtilityTypes.UnionOptions<TZodUnionType>>;

    public getDirectlyResolved(): SpreadModel<
        zodUtilityTypes.UnionOptions<TZodUnionType>
    > {
        return this.#resolvedModel;
    }

    public getRecursivelyResolved(): SpreadModel<
        zodUtilityTypes.RecursiveUnionOptions<TZodUnionType>
    > {
        let resolved: UnknownModel = this.#resolvedModel;

        while (resolved instanceof UnionModelImpl) {
            resolved = resolved.#resolvedModel;
        }

        return resolved as SpreadModel<
            zodUtilityTypes.RecursiveUnionOptions<TZodUnionType>
        >;
    }

    public unknownGetRecursivelyResolved(): UnknownModel {
        // Type system can't understand that SpreadModel results in a Model<T> at all times
        return this.getRecursivelyResolved();
    }

    public getTypes(): ReadonlyArray<z.ZodTypeAny> {
        return this.type.options;
    }

    public async replace(
        value: unknown,
        validate: boolean = true,
    ): Promise<this> {
        const type = findTypeForValue(value, this.type);

        if (!type) {
            throw new TypeError(
                `Parameter value did not match any type of the given union type.`,
            );
        }

        const adoptedResolved = (await validateAndMakeModel<TZodUnionType>(
            value,
            type,
            this.parentInfo,
            validate,
        )) as unknown as SpreadModel<
            zodUtilityTypes.UnionOptions<TZodUnionType>
        >;

        const model = new UnionModelImpl<TZodUnionType>(
            adoptedResolved,
            this.type,
            this.parentInfo,
        );

        // Don't quite understand the as 'this' but oh well
        return model as this;
    }

    public as<TTargetZodType extends z.ZodTypeAny>(
        type: TTargetZodType,
    ): Model<TTargetZodType> | null {
        let resolved = this.#resolvedModel as UnknownModel;

        for (;;) {
            if (resolved.type === type) {
                return resolved as unknown as Model<TTargetZodType>;
            }

            // If the current resolved is a Union, look at its resolved value
            if (resolved instanceof UnionModelImpl) {
                resolved = resolved.#resolvedModel;
            } else {
                break;
            }
        }

        return null;
    }
}
