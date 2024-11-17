import {
    asUnknown,
    type Model,
    ModelFactory,
    createDefault,
    type UnknownModel,
} from '@captainpants/arktype-modeling';

import { type } from 'arktype';

export const stringOnly = type.string;
export const numberOnly = type.number;

export const stringFieldOnly = type({
    test: type.string.annotations().displayName('Test').end(),
});

export const simpleHiddenField = type({
    test: type.string.annotations().displayName('Test').end(),
    hidden: type.string.annotations().visible(false).end(),
});

/**
 * Complicated type including all basic types, rigid and map objects, arrays and unions
 */
export const complex = type({
    string: type.string.annotations().displayName('String').end(),
    boolean: type.boolean.annotations().displayName('Boolean').end(),
    number: type.number.annotations().displayName('Number').end(),
    hidden: type.string
        .annotations()
        .displayName('Hidden')
        .visible(false)
        .end(),
    arrayOfStrings: type.string
        .annotations()
        .displayName('String')
        .end()
        .array()
        .default(() => ['item 1', 'item 2'])
        .annotations()
        .displayName('Array of Strings')
        .end(),
    object: type({
        name: type.string.annotations().displayName('Name').end(),
    })
        .annotations()
        .displayName('Object')
        .end(),
    map: type({
        '[string]': type({
            first: type.string.annotations().displayName('First name').end(),
            last: type.string.annotations().displayName('Last name').end(),
        }),
    })
        .default(() => {
            return {
                test: { first: 'John', last: 'Smith' },
            };
        })
        .annotations()
        .displayName('Map')
        .end(),
    constUnion: type
        .unit('a')
        .or(type.unit('b'))
        .or(type.unit('c'))
        .annotations()
        .displayName('Constant Union')
        .end(),
    objectUnion: type({
        is: type.unit('example-a').annotations().visible(false).end(),
        name: type({
            first: type.string.annotations().displayName('First name').end(),
            last: type.string.annotations().displayName('Last name').end(),
        })
            .annotations()
            .displayName('Name')
            .end(),
    })
        .annotations()
        .displayName('Object A')
        .end()
        .or(
            type({
                is: type.unit('example-b'),
                age: type.number.annotations().displayName('Age').end(),
            })
                .annotations()
                .displayName('Object B')
                .end(),
        ),
})
    .annotations()
    .displayName('Complex Union')
    .end();

export const nestedObjects = type({
    people: type({
        firstName: type.string.annotations().displayName('First name').end(),
        surname: type.string.annotations().displayName('Surname').end(),
        email: type.string.annotations().displayName('Email').end(),
        address: type({
            unit: type.number.or(type.null),
            streetNumber: type.number.or(type.null),
            street: type.string,
            suburb: type.string,
            state: type.string,
            postCode: type.string,
        }),
    }).array(),
})
    .annotations()
    .displayName('People')
    .end();

export const constantUnion = type
    .unit(true)
    .or(type.unit('test'))
    .annotations()
    .end();

export const exampleData = {
    Complex: async () => {
        const res = await ModelFactory.createModel({
            value: createDefault(complex),
            schema: complex,
        });
        return asUnknown(res);
    },
    NestedObjects: async () => {
        const res = await ModelFactory.createModel({
            value: createDefault(nestedObjects),
            schema: nestedObjects,
        });
        return asUnknown(res);
    },
    ConstantUnion: async () => {
        const res = await ModelFactory.createModel({
            value: 'test',
            schema: constantUnion,
        });
        return asUnknown(res);
    },
    StringFieldOnly: async () => {
        const res = await ModelFactory.createModel({
            value: { test: 'Test' },
            schema: stringFieldOnly,
        });
        return asUnknown(res);
    },
    StringOnly: async () => {
        const res = await ModelFactory.createModel({
            value: 'Test',
            schema: stringOnly,
        });
        return asUnknown(res);
    },
    NumberOnly: async () => {
        const res = await ModelFactory.createModel({
            value: 1,
            schema: numberOnly,
        });
        return asUnknown(res);
    },
    SimpleHiddenField: async () => {
        const res = await ModelFactory.createModel({
            value: { test: 'Test', hidden: 'Hello' },
            schema: simpleHiddenField,
        });
        return asUnknown(res);
    },
} as const satisfies Record<string, () => Promise<UnknownModel>>;

export const defaultExample = 'StringFieldOnly';
