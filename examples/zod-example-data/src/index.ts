import {
    asUnknown,
    type Model,
    ModelFactory,
    createDefault,
    type UnknownModel,
} from '@captainpants/zod-modeling';

import { z } from 'zod';

export const stringOnly = z.string();
export const numberOnly = z.number();

export const stringFieldOnly = z.object({
    test: z.string().meta().displayName('Test').endMeta(),
});

export const simpleHiddenField = z.object({
    test: z.string().meta().displayName('Test').endMeta(),
    hidden: z.string().meta().visible(false).endMeta(),
});

/**
 * Complicated type including all basic types, rigid and map objects, arrays and unions
 */
export const complex = z
    .object({
        string: z.string().meta().displayName('String').endMeta(),
        boolean: z.boolean().meta().displayName('Boolean').endMeta(),
        number: z.number().meta().displayName('Number').endMeta(),
        hidden: z
            .string()
            .meta()
            .displayName('Hidden')
            .visible(false)
            .endMeta(),
        arrayOfStrings: z
            .array(z.string().meta().displayName('String').endMeta())
            .default(() => ['item 1', 'item 2'])
            .meta()
            .displayName('Array of Strings')
            .endMeta(),
        object: z
            .object({
                name: z.string().meta().displayName('Name').endMeta(),
            })
            .meta()
            .displayName('Object')
            .endMeta(),
        map: z
            .object({})
            .catchall(
                z.object({
                    first: z
                        .string()
                        .meta()
                        .displayName('First name')
                        .endMeta(),
                    last: z.string().meta().displayName('Last name').endMeta(),
                }),
            )
            .default(() => {
                return {
                    test: { first: 'John', last: 'Smith' },
                };
            })
            .meta()
            .displayName('Map')
            .endMeta(),
        constUnion: z
            .union([z.literal('a'), z.literal('b'), z.literal('c')])
            .meta()
            .displayName('Constant Union')
            .endMeta(),
        objectUnion: z.union([
            z
                .object({
                    is: z.literal('example-a').meta().visible(false).endMeta(),
                    name: z
                        .object({
                            first: z
                                .string()
                                .meta()
                                .displayName('First name')
                                .endMeta(),
                            last: z
                                .string()
                                .meta()
                                .displayName('Last name')
                                .endMeta(),
                        })
                        .meta()
                        .displayName('Name')
                        .endMeta(),
                })
                .meta()
                .displayName('Object A')
                .endMeta(),
            z
                .object({
                    is: z.literal('example-b'),
                    age: z.number().meta().displayName('Age').endMeta(),
                })
                .meta()
                .displayName('Object B')
                .endMeta(),
        ]),
    })
    .meta()
    .displayName('Complex Union')
    .endMeta();

export const nestedObjects = z
    .object({
        people: z.array(
            z.object({
                firstName: z
                    .string()
                    .meta()
                    .displayName('First name')
                    .endMeta(),
                surname: z.string().meta().displayName('Surname').endMeta(),
                email: z.string().meta().displayName('Email').endMeta(),
                address: z.object({
                    unit: z.union([z.null(), z.number()]),
                    streetNumber: z.union([z.null(), z.number()]),
                    street: z.string(),
                    suburb: z.string(),
                    state: z.string(),
                    postCode: z.string(),
                }),
            }),
        ),
    })
    .meta()
    .displayName('People')
    .endMeta();

export const constantUnion = z.union([z.literal(true), z.literal('test')]);

export const exampleData = {
    Complex: async () => {
        return asUnknown(
            await ModelFactory.createModel({
                value: createDefault(complex),
                type: complex,
            }),
        );
    },
    NestedObjects: async () => {
        return asUnknown(
            await ModelFactory.createModel({
                value: createDefault(nestedObjects),
                type: nestedObjects,
            }),
        );
    },
    ConstantUnion: async () => {
        return asUnknown(
            await ModelFactory.createModel({
                value: 'test',
                type: constantUnion,
            }),
        );
    },
    StringFieldOnly: async () => {
        return asUnknown(
            await ModelFactory.createModel({
                value: { test: 'Test' },
                type: stringFieldOnly,
            }),
        );
    },
    StringOnly: async () => {
        return asUnknown(
            await ModelFactory.createModel({
                value: 'Test',
                type: stringOnly,
            }),
        );
    },
    NumberOnly: async () => {
        return asUnknown(
            await ModelFactory.createModel({
                value: 1,
                type: numberOnly,
            }),
        );
    },
    SimpleHiddenField: async () => {
        return asUnknown(
            await ModelFactory.createModel({
                value: { test: 'Test', hidden: 'Hello' },
                type: simpleHiddenField,
            }),
        );
    },
} as const satisfies Record<string, () => Promise<UnknownModel>>;

export const defaultExample = 'StringFieldOnly';
