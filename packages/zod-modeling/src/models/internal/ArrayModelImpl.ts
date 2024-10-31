import { type z } from 'zod';

import { descend } from '@captainpants/sweeter-utilities';

import { mapAsync } from '../../internal/mapAsync.js';
import { arrayMoveImmutable } from '../../utility/arrayMoveImmutable.js';
import { type UnknownModel, type ArrayModel, type Model } from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';
import { type zodUtilityTypes } from '../../utility/zodUtilityTypes.js';

export class ArrayModelImpl<TArrayZodType extends z.ZodArray<any>>
    extends ModelImpl<z.infer<TArrayZodType>, TArrayZodType>
    implements ArrayModel<TArrayZodType>
{
    public static createFromValue<TArrayZodType extends z.ZodArray<any>>(
        value: zodUtilityTypes.ArrayElementType<TArrayZodType>[],
        schema: TArrayZodType,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): ArrayModelImpl<TArrayZodType> {
        const elementModels = value.map((item, index) =>
            ModelFactory.createUnvalidatedModelPart<
                zodUtilityTypes.ArrayElementType<TArrayZodType>
            >({
                value: item,
                type: schema.element,
                parentInfo: {
                    relationship: { type: 'element' },
                    type: schema,
                    parentInfo,
                },
                depth: descend(depth),
            }),
        );

        return new ArrayModelImpl<TArrayZodType>(
            value,
            elementModels,
            schema,
            parentInfo,
        );
    }

    public constructor(
        value: zodUtilityTypes.ArrayElementType<TArrayZodType>[],
        elementModels: ReadonlyArray<
            Model<zodUtilityTypes.ArrayElementType<TArrayZodType>>
        >,
        type: TArrayZodType,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'array');

        this.#elementType = type.element;

        this.#elementModels = elementModels;
    }

    #elementType: zodUtilityTypes.ArrayElementType<TArrayZodType>;
    #elementModels: ReadonlyArray<
        Model<zodUtilityTypes.ArrayElementType<TArrayZodType>>
    >;

    public getElementType(): zodUtilityTypes.ArrayElementType<TArrayZodType> {
        return this.#elementType;
    }

    public unknownGetElementType(): z.ZodType {
        return this.#elementType;
    }

    public getElement(
        index: number,
    ): Model<zodUtilityTypes.ArrayElementType<TArrayZodType>> | undefined {
        return this.#elementModels[index];
    }

    public unknownGetElement(index: number): UnknownModel | undefined {
        return this.getElement(index);
    }

    public getElements(): ReadonlyArray<
        Model<zodUtilityTypes.ArrayElementType<TArrayZodType>>
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
            | z.infer<zodUtilityTypes.ArrayElementType<TArrayZodType>>
            | Model<zodUtilityTypes.ArrayElementType<TArrayZodType>>
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
        const eleDefinition = this.getElementType();

        const newModels = await mapAsync(newElements, async (item) => {
            return await validateAndMakeModel(
                item,
                eleDefinition,
                {
                    type: this.type,
                    parentInfo: this.parentInfo,
                    relationship: { type: 'element' },
                },
                validate,
            );
        });

        const newValue = [...this.value];
        newValue.splice(
            start,
            deleteCount,
            ...newModels.map(
                (x) =>
                    x.value as zodUtilityTypes.ArrayElementType<TArrayZodType>,
            ),
        );

        if (validate) {
            await this.type.parseAsync(newValue);
        }

        const newElementModels = [...this.#elementModels];
        newElementModels.splice(start, deleteCount, ...newModels);

        const res = new ArrayModelImpl(
            newValue,
            newElementModels,
            this.type,
            this.parentInfo,
        );

        return res as this;
    }

    public async moveElement(
        from: number,
        to: number,
        validate: boolean = true,
    ): Promise<this> {
        const newValue = arrayMoveImmutable(this.value, from, to);

        if (validate) {
            await this.type.parseAsync(newValue);
        }

        const newElementModels = arrayMoveImmutable(
            this.#elementModels,
            from,
            to,
        );

        return new ArrayModelImpl<TArrayZodType>(
            newValue,
            newElementModels,
            this.type,
            this.parentInfo,
        ) as this;
    }
}
