import { z } from 'zod';

import { descend } from '@captainpants/sweeter-utilities';

import { mapAsync } from '../../internal/mapAsync.js';
import { arrayMoveImmutable } from '../../utility/arrayMoveImmutable.js';
import { UnknownModel, type ArrayModel, type Model } from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';

export class ArrayModelImpl<TElementZodType extends z.ZodType>
    extends ModelImpl<TElementZodType[], z.ZodArray<TElementZodType>>
    implements ArrayModel<TElementZodType>
{
    public static createFromValue<TElementZodType extends z.ZodType>(
        value: TElementZodType[],
        schema: z.ZodArray<TElementZodType>,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): ArrayModelImpl<TElementZodType> {
        const elementModels = value.map((item, index) =>
            ModelFactory.createUnvalidatedModelPart<TElementZodType>({
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

        return new ArrayModelImpl<TElementZodType>(
            value,
            elementModels,
            schema,
            parentInfo,
        );
    }

    public constructor(
        value: TElementZodType[],
        elementModels: ReadonlyArray<Model<TElementZodType>>,
        type: z.ZodArray<TElementZodType>,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'array');

        this.#elementType = type.element;

        this.#elementModels = elementModels;
    }

    #elementType: TElementZodType;
    #elementModels: ReadonlyArray<Model<TElementZodType>>;

    public getElementType(): TElementZodType {
        return this.#elementType;
    }

    public unknownGetElementType(): z.ZodType {
        return this.#elementType;
    }

    public getElement(index: number): Model<TElementZodType> | undefined {
        return this.#elementModels[index];
    }

    public unknownGetElement(index: number): UnknownModel | undefined {
        return this.getElement(index);
    }

    public getElements(): ReadonlyArray<Model<TElementZodType>> {
        return this.#elementModels;
    }

    public unknownGetElements(): ReadonlyArray<UnknownModel> {
        return this.#elementModels;
    }

    public async spliceElements(
        start: number,
        deleteCount: number,
        newElements: ReadonlyArray<
            z.infer<TElementZodType> | Model<TElementZodType>
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
            ...newModels.map((x) => x.value as TElementZodType),
        );

        if (validate) {
            await this.type.parseAsync(newValue);
        }

        const newElementModels = [...this.#elementModels];
        newElementModels.splice(
            start,
            deleteCount,
            ...(newModels as Model<TElementZodType>[]),
        );

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

        return new ArrayModelImpl<TElementZodType>(
            newValue,
            newElementModels,
            this.type,
            this.parentInfo,
        ) as this;
    }
}
