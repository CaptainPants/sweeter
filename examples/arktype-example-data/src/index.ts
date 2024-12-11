import {
    asUnknown,
    ModelFactory,
    createDefault,
    extendArkTypes,
    UnknownModel,
} from '@captainpants/sweeter-arktype-modeling';

import { type } from 'arktype';

extendArkTypes();

export const stringOnly = type.string;
export const numberOnly = type.number;

export const stringFieldOnly = type({
    test: type.string.annotate((add) => add.displayName('Test')),
});

export const stringArray = type.string.annotate(add => add.displayName('Text Item')).array();

export const simpleHiddenField = type({
    test: type.string.annotate((add) => add.displayName('Test')),
    hidden: type.string.annotate((add) => add.visible(false)),
});

/**
 * Complicated type including all basic types, rigid and map objects, arrays and unions
 */
export const complex = type({
    string: type.string.annotate((add) => add.displayName('String')),
    boolean: type.boolean.annotate((add) => add.displayName('Boolean')),
    number: type.number.annotate((add) => add.displayName('Number')),
    hidden: type.string.annotate((add) =>
        add.displayName('Hidden').visible(false),
    ),
    arrayOfStrings: type.string
        .annotate((add) => add.displayName('String'))
        .array()
        .default(() => ['item 1', 'item 2'])
        .annotate((add) => add.displayName('Array of Strings')),
    object: type({
        name: type.string.annotate((add) => add.displayName('Name')),
    }).annotate((add) => add.displayName('Object')),
    map: type({
        '[string]': type({
            first: type.string.annotate((add) => add.displayName('First name')),
            last: type.string.annotate((add) => add.displayName('Last name')),
        }),
    })
        .default(() => {
            return {
                test: { first: 'John', last: 'Smith' },
            };
        })
        .annotate((add) => add.displayName('Map')),
    constUnion: type
        .unit('a')
        .or(type.unit('b'))
        .or(type.unit('c'))
        .annotate((add) => add.displayName('Constant Union')),
    objectUnion: type({
        is: type.unit('example-a').annotate((add) => add.visible(false)),
        name: type({
            first: type.string.annotate((add) => add.displayName('First name')),
            last: type.string.annotate((add) => add.displayName('Last name')),
        }).annotate((add) => add.displayName('Name')),
    })
        .annotate((add) => add.displayName('Object A'))
        .or(
            type({
                is: type.unit('example-b'),
                age: type.number.annotate((add) => add.displayName('Age')),
            }).annotate((add) => add.displayName('Object B')),
        ),
}).annotate((add) => add.displayName('Complex Union'));

export const nestedObjects = type({
    people: type({
        firstName: type.string.annotate((add) => add.displayName('First name')),
        surname: type.string.annotate((add) => add.displayName('Surname')),
        email: type.string.annotate((add) => add.displayName('Email')),
        address: type({
            unit: type.number.or(type.null),
            streetNumber: type.number.or(type.null),
            street: type.string,
            suburb: type.string,
            state: type.string,
            postCode: type.string,
        }),
    }).array(),
}).annotate((add) => add.displayName('People'));

export const constantUnion = type.unit(true).or(type.unit('test'));

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
    StringArray: async () => {
        const res = await ModelFactory.createModel({
            value: ['alpha', 'beta'],
            schema: stringArray,
        });
        return asUnknown(res);
    }
} as const satisfies Record<string, () => Promise<UnknownModel>>;

export const defaultExample = 'StringFieldOnly';
