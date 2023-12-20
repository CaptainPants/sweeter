import { ArrayType } from './ArrayType.js';
import { type BooleanType } from './BooleanType.js';
import {
    BooleanConstantType,
    NullConstantType,
    NumberConstantType,
    StringConstantType,
    UndefinedConstantType,
} from './ConstantTypes.js';
import { DeferredType } from './DeferredType.js';
import type {
    SpreadUnionType,
    MappedType,
    PropertyDefinitions,
} from './internal/types.js';
import { MapObjectType } from './MapObjectType.js';
import { NumberType } from './NumberType.js';
import { PropertyDefinition } from './PropertyDefinition.js';
import { RigidObjectType } from './RigidObjectType.js';
import { StringType } from './StringType.js';
import { type Type } from './Type.js';
import { UnionType } from './UnionType.js';
import { UnknownType } from './UnknownType.js';

function constant<TString extends string>(
    value: TString,
): StringConstantType<TString>;
function constant<TNumber extends number>(
    value: TNumber,
): NumberConstantType<TNumber>;
function constant(value: true): BooleanConstantType<true>;
function constant(value: false): BooleanConstantType<false>;
function constant(value: unknown): UndefinedConstantType;
function constant(value: null): NullConstantType;
function constant(
    value: boolean,
): BooleanConstantType<true> | BooleanConstantType<false>;
function constant(value: unknown): Type<unknown>;

function constant(value: unknown): unknown {
    if (typeof value === 'string') {
        return new StringConstantType(value) satisfies Type<string>;
    } else if (typeof value === 'number') {
        return new NumberConstantType(value) satisfies Type<number>;
    } else if (value === true || value === false) {
        return new BooleanConstantType(value) satisfies Type<boolean>;
    } else if (value === null) {
        return new NullConstantType() satisfies Type<null>;
    } else if (value === undefined) {
        return new UndefinedConstantType() satisfies Type<undefined>;
    } else {
        throw new TypeError('Not supported');
    }
}

export const Types = {
    unknown(): UnknownType {
        return new UnknownType();
    },

    constant,

    null(): NullConstantType {
        return new NullConstantType();
    },

    undefined(): UndefinedConstantType {
        return new UndefinedConstantType();
    },

    true(): BooleanConstantType<true> {
        return new BooleanConstantType<true>(true);
    },

    false(): BooleanConstantType<false> {
        return new BooleanConstantType<false>(false);
    },

    string(): StringType {
        return new StringType();
    },

    boolean(): BooleanType {
        return this.union(this.true(), this.false());
    },

    number(): NumberType {
        return new NumberType();
    },

    /**
     * Note: if you nest a Union inside a Union they will be flattened together, with all validators brought along with.
     * Other properties of the inner union will be ignored.
     * @param types
     * @returns
     */
    union<TTypeArray extends readonly unknown[]>(
        ...types: MappedType<TTypeArray>
    ) {
        // making the type system unhappy here
        return new UnionType<TTypeArray[number]>(
            types as unknown as SpreadUnionType<TTypeArray[number]>[],
        );
    },

    object<TObject extends Readonly<Record<string, unknown>>>(
        propertyDefinitions: PropertyDefinitions<TObject>,
    ) {
        return new RigidObjectType<TObject>(propertyDefinitions);
    },

    map<TValue>(valueDefinition: Type<TValue>) {
        return new MapObjectType<TValue>(valueDefinition);
    },

    array<TElement>(elementDefinition: Type<TElement>): ArrayType<TElement> {
        return new ArrayType(elementDefinition);
    },

    deferred<TType>(name: string): DeferredType<TType> {
        return new DeferredType<TType>(name);
    },

    prop<TType>(type: Type<TType>) {
        return new PropertyDefinition<TType>(type);
    },
};
