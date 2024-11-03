import { Type } from "arktype";

export type LiteralType<TUnderlying> = Type<TUnderlying> & { 
    readonly compiledValue: TUnderlying;
}