import { z } from "zod";

interface Wrapper {
    unwrap(): z.ZodTypeAny;
}

function isWrapper<TZodType extends z.ZodTypeAny>(schema: TZodType): schema is TZodType & Wrapper {
    return Boolean((schema as (Partial<Wrapper> & TZodType)).unwrap);
}

// TODO: looking into functions to make handling wrapper types more eassily here.
