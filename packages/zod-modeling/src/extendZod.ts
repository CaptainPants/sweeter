import { type z } from 'zod';
import { type MetaData } from './metadata/MetaData.js';
import { MetaDataImpl } from './metadata/internal/MetaDataImpl.js';

declare module 'zod' {
    // eslint-disable-next-line@typescript-eslint/no-explicit-any
    interface ZodType<
        Output = any,
        Def extends z.ZodTypeDef = z.ZodTypeDef,
        Input = Output,
    > {
        meta(): MetaData<ZodType<Output, Def, Input>>;
        hasMetaData(): boolean;
    }
}

export function extendZod(zod: typeof z) {
    zod.ZodType.prototype.meta = function () {
        return MetaDataImpl.get(this, true);
    };

    zod.ZodType.prototype.hasMetaData = function () {
        return MetaDataImpl.tryGet(this) !== undefined;
    };
}
