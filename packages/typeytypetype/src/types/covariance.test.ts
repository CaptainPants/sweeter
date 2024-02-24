/**
 * @file All of the tests in this file are intended as compile time tests to verify the parallel type
 * system is behaving correctly. None of the tests actually do very much when run. Some tests are intended
 * to be illegal and rely on @ts-expect-error to give an error when there is no test on the following line.
 *
 * On revisiting I don't think most of these tests are useful, so should all be deleted except the
 * 'unknown variants' tests.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { UnknownMapObjectType } from './MapObjectType.js';
import { type UnknownRigidObjectType } from './RigidObjectType.js';
import { type Type } from './Type.js';
import { Types } from './Types.js';
import { type UnknownUnionType } from './UnionType.js';

// == The tests

test('types are covariant to unknown', () => {
    // All types are allowed to be Type<unknown>
    const unknown0: Type<unknown> = Types.unknown();
    const unknown1: Type<unknown> = Types.constant('test');
    const unknown2: Type<unknown> = Types.constant(undefined);
    const unknown3: Type<unknown> = Types.constant(null);
    const unknown4: Type<unknown> = Types.constant(1);
    const unknown5: Type<unknown> = Types.constant(true);
    const unknown6: Type<unknown> = Types.constant(false);
    const unknown7: Type<unknown> = Types.string();
    const unknown8: Type<unknown> = Types.number();
    const unknown9: Type<unknown> = Types.boolean();

    const unknown10: Type<unknown> = Types.array(Types.string());
    const unknown11: Type<unknown> = Types.object({
        prop: Types.prop(Types.string()),
    });
    const unknown12: Type<unknown> = Types.map(Types.string());
});

test('typed objects to Record<string, unknown> version', () => {
    const example1: Type<Record<string, unknown>> = Types.object({
        prop: Types.prop(Types.string()),
    });
    const example2: Type<Record<string, unknown>> = Types.map(Types.string());
});

test('typed array to narrower version', () => {
    const example1: Type<unknown[]> = Types.array(Types.string());
    const example2: Type<string[]> = Types.array(Types.constant('test'));
});

test('individual types in a union are compatible with their union types', () => {
    const union0: Type<'example1' | 'example2'> = Types.constant('example1');

    // Including covariance with individual alternatives
    const union1: Type<string> = Types.union(
        Types.constant('example1'),
        Types.constant('example2'),
    );
});

test('constant types are covariant to their unrestricted type', () => {
    const example1: Type<string> = Types.constant('test');
    const example2: Type<number> = Types.constant(1);
    const example3: Type<boolean> = Types.constant(true);
    const example4: Type<boolean> = Types.constant(false);
});

// There are all illegal
test('unrelated types are not compatible', () => {
    // @ts-expect-error -- testing that types are NOT compatible, so this should be illegal
    const example1: Type<number> = Types.constant('test');
    // @ts-expect-error -- testing that types are NOT compatible, so this should be illegal
    const example2: Type<boolean> = Types.constant(1);
    // @ts-expect-error -- testing that types are NOT compatible, so this should be illegal
    const example3: Type<string> = Types.constant(true);
    // @ts-expect-error -- testing that types are NOT compatible, so this should be illegal
    const example4: Type<number> = Types.string();
    // @ts-expect-error -- testing that types are NOT compatible, so this should be illegal
    const example5: Type<boolean> = Types.number();
    // @ts-expect-error -- testing that types are NOT compatible, so this should be illegal
    const example6: Type<string> = Types.boolean();
    // @ts-expect-error -- testing that types are NOT compatible, so this should be illegal
    const example7: Type<{ prop: string }> = Types.null();
    // @ts-expect-error -- testing that types are NOT compatible, so this should be illegal
    const example8: Type<{ prop: string }> = Types.undefined();

    // @ts-expect-error -- testing that types are NOT compatible, so this should be illegal
    const union0: Type<'example1'> = Types.union(
        Types.constant('example1'),
        Types.constant('example2'),
    );

    const unknown: Type<unknown> = Types.string();
    // @ts-expect-error -- testing that types are NOT compatible, so this should be illegal
    const example9: Type<string> = unknown;
});

test('unknown variants', () => {
    const example1: UnknownUnionType = Types.union(
        Types.constant(1),
        Types.map(Types.string()),
    );
    const example2: UnknownRigidObjectType = Types.object({
        property1: Types.prop(Types.string()),
    });
    const example3: UnknownMapObjectType = Types.map(Types.string());
});
