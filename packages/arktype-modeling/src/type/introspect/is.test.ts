import { type } from "arktype";
import { isObjectType } from "./is";

test('isObjectType', () => {
    const schema = type({ test: type.number });
    const failSchema = type.number;

    expect(isObjectType(schema)).toStrictEqual(true);
    expect(isObjectType(failSchema)).toStrictEqual(false);
})