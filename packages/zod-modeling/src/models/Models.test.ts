import { z } from "zod";
import { ArrayModel, LiteralModel, Model, ObjectModel, TypeMatchAssert, UnionModel } from "..";
import { zodUtilityTypes } from "../utility/zodUtilityTypes";

type X = Model<z.ZodArray<z.ZodString>>;

it('All model types match expected results', () => {
    const obj: TypeMatchAssert<
        Model<z.ZodObject<{}>>,
        ObjectModel<z.ZodObject<{}>>
    > = true;

    const array: TypeMatchAssert<
        Model<z.ZodArray<z.ZodString>>,
        ArrayModel<z.ZodArray<z.ZodString>>
    > = true;

    const union_any: TypeMatchAssert<
        Model<zodUtilityTypes.ZodAnyUnionType>,
        UnionModel<zodUtilityTypes.ZodAnyUnionType>
    > = true;
    const union_single: TypeMatchAssert<
        Model<z.ZodUnion<[z.ZodLiteral<1>]>>,
        UnionModel<z.ZodUnion<[z.ZodLiteral<1>]>>
    > = true;
    const union_multiple: TypeMatchAssert<
        Model<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>]>>,
        UnionModel<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>]>>
    > = true;

    const literal_any: TypeMatchAssert<
        Model<z.ZodLiteral<any>>,
        LiteralModel<z.ZodLiteral<any>>
    > = true;

    const literal_number_general: TypeMatchAssert<
        Model<z.ZodLiteral<number>>,
        LiteralModel<z.ZodLiteral<number>>
    > = true;
    const literal_number: TypeMatchAssert<
        Model<z.ZodLiteral<1>>,
        LiteralModel<z.ZodLiteral<1>>
    > = true;

    const literal_string_general: TypeMatchAssert<
        Model<z.ZodLiteral<string>>,
        LiteralModel<z.ZodLiteral<string>>
    > = true;
    const literal_string_specific: TypeMatchAssert<
        Model<z.ZodLiteral<'text'>>,
        LiteralModel<z.ZodLiteral<'text'>>
    > = true;

    const literal_boolean_general: TypeMatchAssert<
        Model<z.ZodLiteral<boolean>>,
        LiteralModel<z.ZodLiteral<boolean>>
    > = true;
    const literal_boolean: TypeMatchAssert<
        Model<z.ZodLiteral<true>>,
        LiteralModel<z.ZodLiteral<true>>
    > = true;
});