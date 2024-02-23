import { descend } from '@captainpants/sweeter-utilities';
import { type Type } from '../../types/Type.js';
import { type UnionType } from '../../types/UnionType.js';
import { type Model, type SpreadModel, type UnionModel } from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';

export class UnionModelImpl<TUnion>
    extends ModelImpl<TUnion, UnionType<TUnion>>
    implements UnionModel<TUnion>
{
    public static createFromValue<TUnion>(
        value: TUnion,
        type: UnionType<TUnion>,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): UnionModelImpl<TUnion> {
        const match = type.findTypeForValue(value);

        if (match === null) {
            throw new Error(`Could not find matching type for value.`);
        }

        const resolved = ModelFactory.createUnvalidatedModelPart<unknown>({
            value,
            type: match,
            parentInfo,
            depth: descend(depth),
        });

        return new UnionModelImpl<TUnion>(value, resolved, type, parentInfo);
    }

    public constructor(
        value: TUnion,
        resolved: Model<unknown>,
        type: UnionType<TUnion>,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'union');

        this.#resolved = resolved;
    }

    #resolved: Model<unknown>;

    public getDirectlyResolved(): Model<unknown> {
        return this.#resolved;
    }

    public getRecursivelyResolved(): SpreadModel<TUnion> {
        let resolved = this.#resolved;

        while (resolved instanceof UnionModelImpl) {
            resolved = resolved.#resolved;
        }

        return resolved as SpreadModel<TUnion>;
    }

    public unknownGetRecursivelyResolved(): Model<unknown> {
        // Type system can't understand that SpreadModel results in a Model<T> at all times
        return this.getRecursivelyResolved() as Model<unknown>;
    }

    public getTypes(): ReadonlyArray<Type<unknown>> {
        return this.type.types;
    }

    public async replace(
        value: unknown,
        validate: boolean = true,
    ): Promise<this> {
        const type = this.type.findTypeForValue(value);

        if (!type) {
            throw new TypeError(
                `Parameter value did not match any type of the given union type.`,
            );
        }

        const adoptedResolved = await validateAndMakeModel<TUnion>(
            value,
            type as Type<TUnion>,
            this.parentInfo,
            validate,
        );

        const model = new UnionModelImpl<TUnion>(
            adoptedResolved.value as TUnion,
            adoptedResolved as Model<unknown>,
            this.type,
            this.parentInfo,
        );

        // Don't quite understand the as 'this' but oh well
        return model as this;
    }

    public as<T>(type: Type<T>): Model<T> | null {
        let resolved = this.#resolved;

        for (;;) {
            if (resolved.type === type) {
                return resolved as unknown as Model<T>;
            }

            // If the current resolved is a Union, look at its resolved value
            if (resolved instanceof UnionModelImpl) {
                resolved = resolved.#resolved;
            } else {
                break;
            }
        }

        return null;
    }
}
