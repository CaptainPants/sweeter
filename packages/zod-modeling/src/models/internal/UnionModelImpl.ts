import { descend } from '@captainpants/sweeter-utilities';
import {
    type SpreadModel,
    type Model,
    type UnionModel,
    type UnknownModel,
} from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';
import { type z } from 'zod';
import { type arkTypeUtilityTypes } from '../../utility/arkTypeUtilityTypes.js';
import { findUnionOptionForValue } from '../findUnionOptionForValue.js';

export class UnionModelImpl<
        TZodUnionType extends arkTypeUtilityTypes.ZodAnyUnionType,
    >
    extends ModelImpl<z.infer<TZodUnionType>, TZodUnionType>
    implements UnionModel<TZodUnionType>
{
    public static createFromValue<
        TZodUnionType extends arkTypeUtilityTypes.ZodAnyUnionType,
    >(
        value: z.infer<TZodUnionType>,
        type: TZodUnionType,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): UnionModelImpl<TZodUnionType> {
        const match = findUnionOptionForValue(value, type);

        if (match === null) {
            throw new Error(`Could not find matching type for value.`);
        }

        const resolvedModel = ModelFactory.createUnvalidatedModelPart<
            arkTypeUtilityTypes.UnionOptions<TZodUnionType>
        >({
            value,
            type: match,
            parentInfo,
            depth: descend(depth),
        }) as unknown as SpreadModel<
            arkTypeUtilityTypes.UnionOptions<TZodUnionType>
        >;

        return new UnionModelImpl<TZodUnionType>(
            resolvedModel,
            type,
            parentInfo,
        );
    }

    public constructor(
        resolvedModel: SpreadModel<arkTypeUtilityTypes.UnionOptions<TZodUnionType>>,
        type: TZodUnionType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(resolvedModel.value, type, parentInfo, 'union');

        this.#resolvedModel = resolvedModel;
    }

    #resolvedModel: SpreadModel<arkTypeUtilityTypes.UnionOptions<TZodUnionType>>;

    public getDirectlyResolved(): SpreadModel<
        arkTypeUtilityTypes.UnionOptions<TZodUnionType>
    > {
        return this.#resolvedModel;
    }

    public getRecursivelyResolved(): SpreadModel<
        arkTypeUtilityTypes.RecursiveUnionOptions<TZodUnionType>
    > {
        let resolved: UnknownModel = this.#resolvedModel;

        while (resolved instanceof UnionModelImpl) {
            resolved = resolved.#resolvedModel;
        }

        return resolved as SpreadModel<
            arkTypeUtilityTypes.RecursiveUnionOptions<TZodUnionType>
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
        const type = findUnionOptionForValue(value, this.type);

        if (!type) {
            throw new TypeError(
                `Parameter value did not match any type of the given union type.`,
            );
        }

        const adoptedResolved = (await validateAndMakeModel<
            arkTypeUtilityTypes.UnionOptions<TZodUnionType>
        >(value, type, this.parentInfo, validate)) as unknown as SpreadModel<
            arkTypeUtilityTypes.UnionOptions<TZodUnionType>
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
