import { descend } from '@captainpants/sweeter-utilities';
import { z } from 'zod';
import { serializeSchemaForDisplay } from './serializeSchemaForDisplay.js';

export function createDefault<TZodType extends z.ZodTypeAny>(
    schema: TZodType,
): z.infer<TZodType> {
    return createDefaultImplementation(schema, descend.defaultDepth);
}

function createDefaultImplementation<TZodType extends z.ZodTypeAny>(
    schema: TZodType,
    depth: number,
): z.infer<TZodType> {
    if (schema instanceof z.ZodDefault) {
        return (schema._def as z.ZodDefaultDef).defaultValue();
    }

    if (schema instanceof z.ZodObject) {
        const instance: Record<string | symbol, unknown> = {};

        for (const [key, type] of Object.entries(
            schema._def.shape as Record<string | symbol, z.ZodTypeAny>,
        )) {
            instance[key] = createDefaultImplementation(type, descend(depth));
        }

        return instance;
    } else if (schema instanceof z.ZodUnion) {
        const typed = schema as z.ZodUnion<
            [z.ZodTypeAny, ...(readonly z.ZodTypeAny[])]
        >;
        return createDefaultImplementation(
            typed._def.options[0],
            descend(depth),
        );
    } else if (schema instanceof z.ZodArray) {
        return [];
    } else if (schema instanceof z.ZodString) {
        return '';
    } else if (schema instanceof z.ZodNumber) {
        return 0;
    } else if (schema instanceof z.ZodBoolean) {
        return false;
    } else if (
        schema instanceof z.ZodUndefined ||
        schema instanceof z.ZodOptional
    ) {
        return undefined;
    } else if (schema instanceof z.ZodNull || schema instanceof z.ZodNullable) {
        return null;
    } else {
        throw new TypeError(
            `Could not create default value for schema ${serializeSchemaForDisplay(
                schema,
            )}`,
        );
    }
}
