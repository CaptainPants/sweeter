import { descend } from '@captainpants/sweeter-utilities';
import { mapAsync } from '../../internal/mapAsync.js';
import { type ArrayType } from '../../types/ArrayType.js';
import { type Type } from '../../types/Type.js';
import { arrayMoveImmutable } from '../../utility/arrayMoveImmutable.js';
import { type ArrayModel, type Model } from '../Model.js';
import { ModelFactory } from '../ModelFactory.js';
import { type ParentTypeInfo } from '../parents.js';

import { ModelImpl } from './ModelImpl.js';
import { validateAndMakeModel } from './validateAndMakeModel.js';

export class ArrayModelImpl<TElement>
    extends ModelImpl<TElement[], ArrayType<TElement>>
    implements ArrayModel<TElement>
{
    public static createFromValue<TElement>(
        value: TElement[],
        type: ArrayType<TElement>,
        parentInfo: ParentTypeInfo | null,
        depth: number,
    ): ArrayModelImpl<TElement> {
        const elementModels = value.map((item, index) =>
            ModelFactory.createUnvalidatedModelPart({
                value: item,
                type: type.elementType,
                parentInfo: {
                    relationship: { type: 'element' },
                    type,
                    parentInfo,
                },
                depth: descend(depth),
            }),
        );

        return new ArrayModelImpl<TElement>(
            value,
            elementModels,
            type,
            parentInfo,
        );
    }

    public constructor(
        value: TElement[],
        elementModels: ReadonlyArray<Model<TElement>>,
        type: ArrayType<TElement>,
        parentInfo: ParentTypeInfo | null,
    ) {
        super(value, type, parentInfo, 'array');

        this.#elementType = type.elementType;

        this.#elementModels = elementModels;
    }

    #elementType: Type<TElement>;
    #elementModels: ReadonlyArray<Model<TElement>>;

    public getElementType(): Type<TElement> {
        return this.#elementType;
    }

    public getElement(index: number): Model<TElement> | undefined {
        return this.#elementModels[index];
    }

    public getElements(): ReadonlyArray<Model<TElement>> {
        return this.#elementModels;
    }

    public async spliceElements(
        start: number,
        deleteCount: number,
        newElements: readonly unknown[],
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
            ...newModels.map((x) => x.value as TElement),
        );

        if (validate) {
            await this.type.validateAndThrow(newValue, { deep: false });
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
            await this.type.validateAndThrow(newValue, { deep: false });
        }

        const newElementModels = arrayMoveImmutable(
            this.#elementModels,
            from,
            to,
        );

        return new ArrayModelImpl<TElement>(
            newValue,
            newElementModels,
            this.type,
            this.parentInfo,
        ) as this;
    }
}
