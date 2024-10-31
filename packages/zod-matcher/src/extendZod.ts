import { z } from 'zod';
import { MetaData } from './metadata/MetaData';
import { MetaDataImpl } from './metadata/internal/MetaDataImpl';

declare module 'zod' {
    interface ZodType<Output = any, Def extends z.ZodTypeDef = z.ZodTypeDef, Input = Output> {
        meta(): MetaData<ZodType<Output, Def, Input>>;
        hasMetaData(): boolean;
    }
}

export function extendZod(zod: typeof z) {
    zod.ZodType.prototype.meta = function() {
        return MetaDataImpl.get(this, true);
    };

    zod.ZodType.prototype.hasMetaData = function () {
        return MetaDataImpl.tryGet(this) !== undefined;
    };
}
