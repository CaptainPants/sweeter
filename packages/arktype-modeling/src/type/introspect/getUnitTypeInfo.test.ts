import { type } from "arktype";
import { getUnitTypeInfo } from "./getUnitTypeInfo";

it('getUnitTypeInfo', () => {
    expect(getUnitTypeInfo(type.unit(1))?.value).toStrictEqual(1);
    expect(getUnitTypeInfo(type.unit('test'))?.value).toStrictEqual('test');
    expect(getUnitTypeInfo(type.unit(true))?.value).toStrictEqual(true);
    expect(getUnitTypeInfo(type.unit(undefined))?.value).toStrictEqual(undefined);
    expect(getUnitTypeInfo(type.unit(null))?.value).toStrictEqual(null);
});