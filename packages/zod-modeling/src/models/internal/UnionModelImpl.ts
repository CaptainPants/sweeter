import { descend } from '@captainpants/sweeter-utilities';
import { Type, type } from 'arktype';

import {
    type SpreadModel,
    type Model,
    type UnionModel,
    type UnspecifiedModel,
} from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';
import { type arkTypeUtilityTypes } from '../../utility/arkTypeUtilityTypes.js';
import { findUnionOptionForValue } from '../findUnionOptionForValue.js';
import { AnyTypeConstraint } from '../../type/AnyTypeConstraint.js';
import { getUnionInfo } from '../../type/introspect/getUnionInfo.js';

export class UnionModelImpl<
        TUnionArkType extends AnyTypeConstraint,
    >
    extends ModelImpl<type.infer<TUnionArkType>, TUnionArkType>
    implements UnionModel<TUnionArkType>
{
    public static createFromValue<
        TUnionArkType extends AnyTypeConstraint,
    >(
        value: type.infer<TUnionArkType>,
        type: TUnionArkType,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): UnionModelImpl<TUnionArkType> {
        const match = findUnionOptionForValue(value, type);

        if (match === null) {
            throw new Error(`Could not find matching type for value.`);
        }

        const resolvedModel = ModelFactory.createUnvalidatedModelPart<
            arkTypeUtilityTypes.UnionOptions<TUnionArkType>
        >({
            value: value as never,
            arkType: match,
            parentInfo,
            depth: descend(depth),
        }) as unknown as SpreadModel<
            arkTypeUtilityTypes.UnionOptions<TUnionArkType>
        >;

        return new UnionModelImpl<TUnionArkType>(
            resolvedModel,
            type,
            parentInfo,
        );
    }

    public constructor(
        resolvedModel: SpreadModel<arkTypeUtilityTypes.UnionOptions<TUnionArkType>>,
        type: TUnionArkType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(resolvedModel.value, type, parentInfo, 'union');

        this.#resolvedModel = resolvedModel;
    }

    #resolvedModel: SpreadModel<arkTypeUtilityTypes.UnionOptions<TUnionArkType>>;

    public unknownGetDirectlyResolved(): Model<Type<unknown>> {
        return this.#resolvedModel as never;
    }
    public getDirectlyResolved(): SpreadModel<arkTypeUtilityTypes.UnionOptions<TUnionArkType>> {
        return this.#resolvedModel;
    }

    public getTypes(): ReadonlyArray<AnyTypeConstraint> {
        return getUnionInfo(this.type).branches;
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
            arkTypeUtilityTypes.UnionOptions<TUnionArkType>
        >(value, type, this.parentInfo, validate)) as unknown as SpreadModel<
            arkTypeUtilityTypes.UnionOptions<TUnionArkType>
        >;

        const model = new UnionModelImpl<TUnionArkType>(
            adoptedResolved,
            this.type,
            this.parentInfo,
        );

        // Don't quite understand the as 'this' but oh well
        return model as this;
    }

    public as<TTargetArkType extends AnyTypeConstraint>(
        type: TTargetArkType,
    ): Model<TTargetArkType> | null {
        let resolved = this.#resolvedModel as UnspecifiedModel;

        for (;;) {
            if (resolved.type === type) {
                return resolved as unknown as Model<TTargetArkType>;
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
