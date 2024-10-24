import z from 'zod';

export function is<TRes>(val: unknown, type: z.ZodType<TRes>): val is TRes {
    const res = type.safeParse(val);
    return !res.error;
}

export function isObjectType(schema: z.ZodType): schema is z.ZodObject<any> {
    return schema instanceof z.ZodRecord && isStringType(schema.keySchema);
}
export function isArrayType(
    schema: z.ZodType,
): schema is z.ZodArray<z.ZodTypeAny> {
    return schema instanceof z.ZodArray;
}

export function isUnionType(
    schema: z.ZodType,
): schema is z.ZodUnion<[z.ZodTypeAny, ...z.ZodTypeAny[]]> {
    return schema instanceof z.ZodUnion;
}

export function isNumberType(
    schema: z.ZodType<unknown>,
): schema is z.ZodNumber {
    return schema instanceof z.ZodNumber;
}

export function isStringType(schema: z.ZodType): schema is z.ZodString {
    return schema instanceof z.ZodString;
}

export function isBooleanType(schema: z.ZodType): schema is z.ZodBoolean {
    return schema instanceof z.ZodBoolean;
}

export function isNumberLiteralType(
    schema: z.ZodType,
): schema is z.ZodLiteral<number> {
    return schema instanceof z.ZodLiteral && typeof schema.value === 'number';
}

export function isStringLiteralType(
    schema: z.ZodType,
): schema is z.ZodLiteral<string> {
    return schema instanceof z.ZodLiteral && typeof schema.value === 'string';
}

export function isBooleanLiteralType(
    schema: z.ZodType,
): schema is z.ZodLiteral<boolean> {
    return schema instanceof z.ZodLiteral && typeof schema.value === 'boolean';
}

export function isBooleanTrueLiteral(
    schema: z.ZodType,
): schema is z.ZodLiteral<true> {
    return schema instanceof z.ZodLiteral && schema.value === true;
}

export function isBooleanFalseLiteralType(
    schema: z.ZodType,
): schema is z.ZodLiteral<true> {
    return schema instanceof z.ZodLiteral && schema.value === false;
}

export function isNullLiteralType(schema: z.ZodType): schema is z.ZodNull {
    return schema instanceof z.ZodNull;
}

export function isUndefinedLiteralType(
    type: z.ZodType,
): type is z.ZodUndefined {
    return type instanceof z.ZodUndefined;
}

export function isConstantType(
    schema: z.ZodType,
): schema is
    | z.ZodLiteral<string>
    | z.ZodLiteral<number>
    | z.ZodLiteral<true>
    | z.ZodLiteral<false>
    | z.ZodNull
    | z.ZodUndefined {
    return (
        isStringLiteralType(schema) ||
        isNumberLiteralType(schema) ||
        isBooleanLiteralType(schema) ||
        isNullLiteralType(schema) ||
        isUndefinedLiteralType(schema)
    );
}

export function isStringOrStringConstantType(
    schema: z.ZodType,
): schema is z.ZodString | z.ZodLiteral<string> {
    return isStringType(schema) || isStringLiteralType(schema);
}

export function isNumberOrNumberConstantType(
    schema: z.ZodType,
): schema is z.ZodNumber | z.ZodLiteral<number> {
    return isNumberType(schema) || isNumberLiteralType(schema);
}

export function isUnknownType(schema: z.ZodType): schema is z.ZodUnknown {
    return schema instanceof z.ZodUnknown;
}
