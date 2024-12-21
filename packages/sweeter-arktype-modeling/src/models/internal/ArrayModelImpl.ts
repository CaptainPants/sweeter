import { descend } from '@captainpants/sweeter-utilities';

import { mapAsync } from '../../internal/mapAsync.js';
import { arrayMoveImmutable } from '../../utility/arrayMoveImmutable.js';
import {
    type UnknownModel,
    type ArrayModel,
    type ElementModel,
} from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { ParentRelationship, type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';
import { type arkTypeUtilityTypes } from '../../utility/arkTypeUtilityTypes.js';
import { type type, type Type } from 'arktype';
import { type ArrayType } from 'arktype/internal/methods/array.ts';
import { getArrayTypeInfo } from '../../type/introspect/getArrayTypeInfo.js';
import { type AnyTypeConstraint } from '../../type/types.js';
import { parseAsync } from '../../utility/parse.js';

export class ArrayModelImpl<TArraySchema extends Type<unknown[]>>
    extends ModelImpl<type.infer<TArraySchema>, TArraySchema>
    implements ArrayModel<TArraySchema>
{
    public static createFromValue<TArrayArkType extends ArrayType<unknown[]>>(
        value: type.infer<TArrayArkType>,
        schema: TArrayArkType,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): ArrayModelImpl<TArrayArkType> {
        const info = getArrayTypeInfo(schema);
        const elementType =
            info.elementType as arkTypeUtilityTypes.ArrayElementSchema<TArrayArkType>;

        const elementModels = (value as readonly unknown[]).map((item, index) =>
            ModelFactory.createModelPart<
                /* @ts-expect-error - Type system doesn't know that this is always a Type<?> */
                arkTypeUtilityTypes.ArrayElementSchema<TArrayArkType>
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
        value: type.infer<TArraySchema>,
        elementType: arkTypeUtilityTypes.ArrayElementSchema<TArraySchema>,
        elementModels: readonly ElementModel<TArraySchema>[],
        type: TArraySchema,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'array');

        this.#elementType = elementType;

        this.#elementModels = elementModels;
    }

    #elementType: arkTypeUtilityTypes.ArrayElementSchema<TArraySchema>;
    #elementModels: ReadonlyArray<ElementModel<TArraySchema>>;

    public getElementType(): arkTypeUtilityTypes.ArrayElementSchema<TArraySchema> {
        return this.#elementType;
    }

    public unknownGetElementType(): AnyTypeConstraint {
        return this.#elementType as never;
    }

    public getElement(index: number): ElementModel<TArraySchema> | undefined {
        return this.#elementModels[index];
    }

    public unknownGetElement(index: number): UnknownModel | undefined {
        return this.getElement(index) as never;
    }

    public getElements(): ReadonlyArray<ElementModel<TArraySchema>> {
        return this.#elementModels;
    }

    public unknownGetElements(): ReadonlyArray<UnknownModel> {
        return this.#elementModels;
    }

    public async spliceElements(
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<
            | type.infer<arkTypeUtilityTypes.ArrayElementSchema<TArraySchema>>
            | ElementModel<TArraySchema>
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

    public setIndex(
        index: number,
        value: ElementModel<TArraySchema>,
        validate: boolean = true,
    ): Promise<this> {
        return this.unknownSetIndex(index, value, validate);
    }

    public async unknownSpliceElements(
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<unknown | UnknownModel>,
        validate: boolean = true,
    ): Promise<this> {
        const eleDefinition = this.getElementType() as Type<unknown>;

        const newModels = await mapAsync(newElements, async (item) => {
            const parentInfo: ParentTypeInfo = {
                type: this.type,
                parentInfo: this.parentInfo,
                relationship: { type: 'element' },
            };

            return await validateAndMakeModel(item, eleDefinition, parentInfo);
        });

        const newValue = [
            ...(this
                .value as arkTypeUtilityTypes.ArrayElementType<TArraySchema>[]),
        ];
        newValue.splice(
            start,
            deleteCount,
            ...newModels.map(
                (x) =>
                    x.value as arkTypeUtilityTypes.ArrayElementType<TArraySchema>,
            ),
        );

        if (validate) {
            await parseAsync(newValue, this.type);
        }

        const newElementModels = [...this.#elementModels];
        newElementModels.splice(
            start,
            deleteCount,
            ...(newModels as ElementModel<TArraySchema>[]),
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

    public async unknownSetIndex(
        index: number,
        value: unknown | UnknownModel,
        validate: boolean = true,
    ): Promise<this> {
        const eleDefinition = this.getElementType() as Type<unknown>;

        const existing = this.#elementModels[index];
        if (!existing) {
            throw new Error(
                'You may only assign values with an index < length',
            );
        }

        const model = await validateAndMakeModel(
            value,
            eleDefinition,
            existing.parentInfo,
        );

        const newValue = [...(this.value as unknown[])];
        newValue[1] = model.value;

        if (validate) {
            await parseAsync(newValue, this.type);
        }

        const newElementModels = [...this.#elementModels];
        newElementModels[index] = model as ElementModel<TArraySchema>;

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
            this.value as arkTypeUtilityTypes.ArrayElementType<TArraySchema>[],
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

        return new ArrayModelImpl<TArraySchema>(
            newValue as never,
            this.#elementType as never,
            newElementModels,
            this.type,
            this.parentInfo,
        ) as this;
    }
}
