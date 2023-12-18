

import { Types } from './Types.js';

test('constant', () => {
    expect(Types.constant(1).matches(1)).toStrictEqual(true);
    expect(Types.constant(1).matches(2)).toStrictEqual(false);

    expect(Types.constant('yes').matches('yes')).toStrictEqual(true);
    expect(Types.constant('yes').matches('no')).toStrictEqual(false);

    expect(Types.constant(true).matches(true)).toStrictEqual(true);
    expect(Types.constant(true).matches(false)).toStrictEqual(false);
    expect(Types.constant(false).matches(false)).toStrictEqual(true);

    expect(Types.null().matches(null)).toStrictEqual(true);
    expect(Types.constant(1).matches(null)).toStrictEqual(false);
});

test('string', () => {
    const type = Types.string();

    expect(type.matches('test')).toStrictEqual(true);
    expect(type.matches(false)).toStrictEqual(false);
    expect(type.matches(123)).toStrictEqual(false);
    expect(type.matches({})).toStrictEqual(false);
});

test('number', () => {
    const type = Types.number();

    expect(type.matches(123)).toStrictEqual(true);

    expect(type.matches('test')).toStrictEqual(false);
    expect(type.matches(false)).toStrictEqual(false);
    expect(type.matches({})).toStrictEqual(false);
});

test('boolean', () => {
    const type = Types.boolean();

    expect(type.matches(false)).toStrictEqual(true);
    expect(type.matches(true)).toStrictEqual(true);

    expect(type.matches('test')).toStrictEqual(false);
    expect(type.matches(123)).toStrictEqual(false);
    expect(type.matches({})).toStrictEqual(false);
});

test('array', () => {
    const type = Types.array(Types.number());

    expect(type.matches([1, 2])).toStrictEqual(true);
    expect(type.matches(['test', 2])).toStrictEqual(false);
    expect(type.matches(1)).toStrictEqual(false);
});

test('object', () => {
    const type = Types.object({
        id: Types.prop(Types.number()),
        name: Types.prop(Types.string()),
        roles: Types.prop(Types.array(Types.string())),
    });

    expect(
        type.matches({
            id: 1,
            name: 'test',
            roles: ['Administrator'],
        }),
    ).toStrictEqual(true);
    expect(type.matches({ id: 1 })).toStrictEqual(false);
    expect(type.toTypeString()).toMatchSnapshot();
});

test('union', () => {
    const type = Types.union(
        Types.constant(1),
        Types.constant(2),
        Types.null(),
    );

    expect(type.matches(1)).toStrictEqual(true);
    expect(type.matches(2)).toStrictEqual(true);
    expect(type.matches(null)).toStrictEqual(true);

    expect(type.matches(3)).toStrictEqual(false);
});
