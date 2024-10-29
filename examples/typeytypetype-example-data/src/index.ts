import {
    asUnknown,
    type Model,
    ModelFactory,
} from '@captainpants/zod-matcher';

import { z } from 'zod';

export const stringOnly = z.string();
export const numberOnly = z.number();

export const stringFieldOnly = z.object({
    test: z.string().meta().withDisplayName('Test').endMeta(),
});

export const simpleHiddenField = z.object({
    test: z.string().meta().withDisplayName('Test').endMeta(),
    hidden: z.string().meta().visible(false).endMeta(),
});

/**
 * Complicated type including all basic types, rigid and map objects, arrays and unions
 */
export const complex = z.object({
    string: z.string().meta().withDisplayName('String').endMeta(),
    boolean: z.boolean().meta().withDisplayName('Boolean').endMeta(),
    number: z.number().meta().withDisplayName('Number').endMeta(),
    hidden: z.string()
        .meta()
        .withDisplayName('Hidden')
        .visible(false)
        .endMeta(),
    arrayOfStrings:
        z
            .array(z.string().meta().withDisplayName('String').endMeta())
            .default(
                () => ['item 1', 'item 2'],
            )
            .meta().withDisplayName('Array of Strings').endMeta(),
    object: z.object({
            name: z.string().meta().withDisplayName('Name').endMeta(),
        }).meta().withDisplayName('Object').endMeta(),
    map: z.object({}).catchall(z.object({
        first: z.string().meta().withDisplayName('First name').endMeta(),
        last: z.string().meta().withDisplayName('Last name').endMeta(),
    })).default(() => {
            return {
                test: { first: 'John', last: 'Smith' },
            };
        }).meta().withDisplayName('Map').endMeta(),
    constUnion: z.union([
        z.literal('a'),
        z.literal('b'),
        z.literal('c')
    ]).meta().withDisplayName('Constant Union').endMeta(),
    objectUnion: 
        z.union([
            z.object({
                is: z.literal('example-a').meta().visible(false).endMeta(),
                name: z.object({
                    first: z.string().meta().withDisplayName(
                        'First name',
                    ).endMeta(),
                    last: z.string().meta().withDisplayName(
                        'Last name',
                    ).endMeta(),
                }).meta().withDisplayName('Name').endMeta()
            }).meta().withDisplayName('Object A').endMeta(),
            z.object({
                is: z.literal('example-b'),
                age: z.number().meta().withDisplayName('Age').endMeta(),
            }).meta().withDisplayName('Object B').endMeta()
        ]),
    }).meta().withDisplayName('Complex Union').endMeta();

export const nestedObjects = z.object({
    people: z.array(
        z.object({
            firstName: z.string().meta().withDisplayName(
                'First name',
            ).endMeta(),
            surname: z.string().meta().withDisplayName('Surname').endMeta(),
            email: z.string().meta().withDisplayName('Email').endMeta(),
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
    }).meta().withDisplayName('People').endMeta();

export const constantUnion = z.union(
    [z.literal(true),
    z.literal('test')],
);

export const exampleData = {
    Complex: async () => {
        return asUnknown(
            await ModelFactory.createModel({
                value: complex.createDefault(),
                type: complex,
            }),
        );
    },
    NestedObjects: async () => {
        return asUnknown(
            await ModelFactory.createModel({
                value: nestedObjects.createDefault(),
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
} as const satisfies Record<string, () => Promise<Model<unknown>>>;

export const defaultExample = 'StringFieldOnly';
