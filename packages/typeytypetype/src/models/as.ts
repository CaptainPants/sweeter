import {
    isArrayType,
    isBooleanConstantType,
    isMapObjectType,
    isNullType,
    isNumberConstantType,
    isNumberType,
    isRigidObjectType,
    isStringConstantType,
    isStringType,
    isUndefinedType,
    isUnionType,
} from '../types/index.js';

import { isModel } from './isModel.js';
import {
    type MapObjectModel,
    type ArrayModel,
    type BooleanConstantModel,
    type Model,
    type NullModel,
    type NumberConstantModel,
    type NumberModel,
    type StringConstantModel,
    type StringModel,
    type UndefinedModel,
    type UnionModel,
    type RigidObjectModel,
    type AnyModelConstraint,
} from './Model.js';

export function cast<TToModel, TFromType>(
    model: Model<TFromType>,
    as: (model: Model<TFromType>) => TToModel | undefined,
): TToModel {
    const typed = as(model as unknown as Model<TFromType>);
    if (!typed) {
        throw new TypeError(`Invalid cast using ${as.name}`);
    }
    return typed;
}

export function asUnion<TFrom>(
    model: Model<TFrom>,
): UnionModel<unknown> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isUnionType(model.type) ? (model as any) : undefined;
}

export function asRigidObject<TFrom>(
    model: Model<TFrom>,
): RigidObjectModel<Record<string, unknown>> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isRigidObjectType(model.type) ? (model as any) : undefined;
}

export function asMap<TFrom>(
    model: Model<TFrom>,
): MapObjectModel<unknown> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isMapObjectType(model.type) ? (model as any) : undefined;
}

export function asArray<TFrom>(
    model: Model<TFrom>,
): ArrayModel<unknown> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isArrayType(model.type) ? (model as any) : undefined;
}

export function asNumber<TFrom>(model: Model<TFrom>): NumberModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNumberType(model.type) ? (model as any) : undefined;
}

export function asBoolean<TFrom>(
    model: Model<TFrom>,
): UnionModel<true | false> | undefined {
    const isUnion =
        isUnionType(model.type) &&
        model.type.types.every((x) => isBooleanConstantType(x));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isUnion ? (model as any) : undefined;
}

export function asString<TFrom>(model: Model<TFrom>): StringModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isStringType(model.type) ? (model as any) : undefined;
}

export function asNumberConstant<TFrom>(
    model: Model<TFrom>,
): NumberConstantModel<number> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNumberConstantType(model.type) ? (model as any) : undefined;
}

export function asStringConstant<TFrom>(
    model: Model<TFrom>,
): StringConstantModel<string> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isStringConstantType(model.type) ? (model as any) : undefined;
}

export function asBooleanConstant<TFrom>(
    model: Model<TFrom>,
): BooleanConstantModel<boolean> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isBooleanConstantType(model.type) ? (model as any) : undefined;
}

export function asNullConstant<TFrom>(
    model: Model<TFrom>,
): NullModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isNullType(model.type) ? (model as any) : undefined;
}

export function asUndefinedConstant<TFrom>(
    model: Model<TFrom>,
): UndefinedModel | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return isUndefinedType(model.type) ? (model as any) : undefined;
}

/**
 * Slightly ugly overload to allow for unions of model types, and therefore relatively easy access to casting these to other types.
 * @param model
 */

export function asUnknown<TModel extends AnyModelConstraint>(
    model: TModel,
): Model<unknown>;
export function asUnknown<T>(model: Model<T>): Model<unknown>;
export function asUnknown(model: unknown): Model<unknown> {
    if (isModel(model)) {
        return model;
    } else {
        throw new TypeError(`Provided value was not a model`);
    }
}

export function asConstant<TFrom>(
    model: Model<TFrom>,
): Model<unknown> | undefined {
    if (
        isStringConstantType(model.type) ||
        isNumberConstantType(model.type) ||
        isBooleanConstantType(model.type) ||
        isNullType(model.type) ||
        isUndefinedType(model.type)
    ) {
        return asUnknown(model);
    }
    return undefined;
}
