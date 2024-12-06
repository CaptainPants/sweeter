import { descend } from '@captainpants/sweeter-utilities';

import { mapAsync } from '../../internal/mapAsync.js';
import { arrayMoveImmutable } from '../../utility/arrayMoveImmutable.js';
import {
    type UnknownModel,
    type ArrayModel,
    type ElementModelNoConstraint,
} from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';
import { type arkTypeUtilityTypes } from '../../utility/arkTypeUtilityTypes.js';
import { type type, type Type } from 'arktype';
import { type ArrayType } from 'arktype/internal/methods/array.ts';
import { getArrayTypeInfo } from '../../type/introspect/getArrayTypeInfo.js';
import { type AnyTypeConstraint } from '../../type/types.js';
import { parseAsync } from '../../utility/parse.js';

export class ArrayModelImpl<TArrayArkType extends Type<unknown[]>>
    extends ModelImpl<type.infer<TArrayArkType>, TArrayArkType>
    implements ArrayModel<TArrayArkType>
{
    public static createFromValue<TArrayArkType extends ArrayType<unknown[]>>(
        value: type.infer<TArrayArkType>,
        schema: TArrayArkType,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): ArrayModelImpl<TArrayArkType> {
        const info = getArrayTypeInfo(schema);
        const elementType =
            info.elementType as arkTypeUtilityTypes.ArrayElementArkType<TArrayArkType>;

        const elementModels = (value as readonly unknown[]).map((item, index) =>
            ModelFactory.createModelPart<
                /* @ts-expect-error - Type system doesn't know that this is always a Type<?> */
                arkTypeUtilityTypes.ArrayElementArkType<TArrayArkType>
            >({
                value: item as never,
                schema: elementType as never,
                parentInfo: {
                    relationship: { type: 'element' },
                    type: schema,
                    parentInfo,
                },
                depth: descend(depth),
            }),
        );

        return new ArrayModelImpl<TArrayArkType>(
            value,
            elementType,
            elementModels as never,
            schema,
            parentInfo,
        );
    }

    public constructor(
        value: type.infer<TArrayArkType>,
        elementType: arkTypeUtilityTypes.ArrayElementArkType<TArrayArkType>,
        elementModels: readonly ElementModelNoConstraint<TArrayArkType>[],
        type: TArrayArkType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'array');

        this.#elementType = elementType;

        this.#elementModels = elementModels;
    }

    #elementType: arkTypeUtilityTypes.ArrayElementArkType<TArrayArkType>;
    #elementModels: ReadonlyArray<ElementModelNoConstraint<TArrayArkType>>;

    public getElementType(): arkTypeUtilityTypes.ArrayElementArkType<TArrayArkType> {
        return this.#elementType;
    }

    public unknownGetElementType(): AnyTypeConstraint {
        return this.#elementType as never;
    }

    public getElement(
        index: number,
    ): ElementModelNoConstraint<TArrayArkType> | undefined {
        return this.#elementModels[index];
    }

    public unknownGetElement(index: number): UnknownModel | undefined {
        return this.getElement(index) as never;
    }

    public getElements(): ReadonlyArray<
        ElementModelNoConstraint<TArrayArkType>
    > {
        return this.#elementModels;
    }

    public unknownGetElements(): ReadonlyArray<UnknownModel> {
        return this.#elementModels;
    }

    public async spliceElements(
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<
            | type.infer<arkTypeUtilityTypes.ArrayElementArkType<TArrayArkType>>
            | ElementModelNoConstraint<TArrayArkType>
        >,
        validate: boolean = true,
    ): Promise<this> {
        return this.unknownSpliceElements(
            start,
            deleteCount,
            newElements,
            validate,
        );
    }

    public async unknownSpliceElements(
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<unknown | UnknownModel>,
        validate: boolean = true,
    ): Promise<this> {
        const eleDefinition = this.getElementType() as Type<unknown>;

        const newModels = await mapAsync(newElements, async (item) => {
            return await validateAndMakeModel(item, eleDefinition, {
                type: this.type,
                parentInfo: this.parentInfo,
                relationship: { type: 'element' },
            });
        });

        const newValue = [
            ...(this
                .value as arkTypeUtilityTypes.ArrayElementType<TArrayArkType>[]),
        ];
        newValue.splice(
            start,
            deleteCount,
            ...newModels.map(
                (x) =>
                    x.value as arkTypeUtilityTypes.ArrayElementType<TArrayArkType>,
            ),
        );

        if (validate) {
            await parseAsync(newValue, this.type);
        }

        const newElementModels = [...this.#elementModels];
        newElementModels.splice(
            start,
            deleteCount,
            ...(newModels as ElementModelNoConstraint<TArrayArkType>[]),
        );

        const res = new ArrayModelImpl(
            newValue,
            this.#elementType as never,
            newElementModels,
            this.type,
            this.parentInfo,
        );

        return res as unknown as this;
    }

    public async moveElement(
        from: number,
        to: number,
        validate: boolean = true,
    ): Promise<this> {
        const newValue = arrayMoveImmutable(
            this.value as arkTypeUtilityTypes.ArrayElementType<TArrayArkType>[],
            from,
            to,
        );

        if (validate) {
            await parseAsync(newValue, this.type);
        }

        const newElementModels = arrayMoveImmutable(
            this.#elementModels,
            from,
            to,
        );

        return new ArrayModelImpl<TArrayArkType>(
            newValue as never,
            this.#elementType as never,
            newElementModels,
            this.type,
            this.parentInfo,
        ) as this;
    }
}
