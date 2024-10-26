import {
    asUnknown,
    type Model,
    ModelFactory,
    Types,
} from '@captainpants/zod-matcher';

export const stringOnly = Types.string();
export const numberOnly = Types.number();

export const stringFieldOnly = Types.object({
    test: Types.prop(Types.string()).withDisplayName('Test'),
});

export const simpleHiddenField = Types.object({
    test: Types.prop(Types.string()).withDisplayName('Test'),
    hidden: Types.prop(Types.string()).withVisibility(false),
});

/**
 * Complicated type including all basic types, rigid and map objects, arrays and unions
 */
export const complex = Types.object({
    string: Types.prop(Types.string()).withDisplayName('String'),
    boolean: Types.prop(Types.boolean()).withDisplayName('Boolean'),
    number: Types.prop(Types.number()).withDisplayName('Number'),
    hidden: Types.prop(Types.string())
        .withDisplayName('Hidden')
        .withVisibility(false),
    arrayOfStrings: Types.prop(
        Types.array(Types.string().withDisplayName('String')).withDefault(
            () => ['item 1', 'item 2'],
        ),
    ).withDisplayName('Array of Strings'),
    object: Types.prop(
        Types.object({
            name: Types.prop(Types.string()).withDisplayName('Name'),
        }),
    ).withDisplayName('Object'),
    map: Types.prop(
        Types.map(
            Types.object({
                first: Types.prop(Types.string()).withDisplayName('First name'),
                last: Types.prop(Types.string()).withDisplayName('Last name'),
            }),
        ).withDefault(() => {
            return {
                test: { first: 'John', last: 'Smith' },
            };
        }),
    ).withDisplayName('Map'),
    constUnion: Types.prop(
        Types.union(
            Types.constant('a'),
            Types.constant('b'),
            Types.constant('c'),
        ),
    ).withDisplayName('Constant Union'),
    objectUnion: Types.prop(
        Types.union(
            Types.object({
                is: Types.prop(Types.constant('example-a')).withVisibility(
                    false,
                ),
                name: Types.prop(
                    Types.object({
                        first: Types.prop(Types.string()).withDisplayName(
                            'First name',
                        ),
                        last: Types.prop(Types.string()).withDisplayName(
                            'Last name',
                        ),
                    }),
                ).withDisplayName('Name'),
            }).withDisplayName('Object A'),
            Types.object({
                is: Types.prop(Types.constant('example-b')),
                age: Types.prop(Types.number()).withDisplayName('Age'),
            }).withDisplayName('Object B'),
        ),
    ).withDisplayName('Complex Union'),
});

export const nestedObjects = Types.object({
    people: Types.prop(
        Types.array(
            Types.object({
                firstName: Types.prop(Types.string()).withDisplayName(
                    'First name',
                ),
                surname: Types.prop(Types.string()).withDisplayName('Surname'),
                email: Types.prop(Types.string()).withDisplayName('Email'),
                address: Types.prop(
                    Types.object({
                        unit: Types.prop(
                            Types.union(Types.null(), Types.number()),
                        ),
                        streetNumber: Types.prop(
                            Types.union(Types.null(), Types.number()),
                        ),
                        street: Types.prop(Types.string()),
                        suburb: Types.prop(Types.string()),
                        state: Types.prop(Types.string()),
                        postCode: Types.prop(Types.string()),
                    }),
                ),
            }),
        ),
    ).withDisplayName('People'),
});

export const constantUnion = Types.union(
    Types.constant(true),
    Types.constant('test'),
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
