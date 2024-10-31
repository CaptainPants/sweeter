import { type Maybe } from '../utility/index.js';

export type ValidatorResult =
    | string[]
    | Iterable<string>
    | null
    | Promise<string[] | Iterable<string> | null>;

export type Validator<T> = (
    value: T,
) => ValidatorResult | Promise<ValidatorResult>;

export interface ValidationSingleResult {
    idPath?: string | undefined;
    message: string;
}
export type ValidationResult<T> = Promise<Maybe<T, ValidationSingleResult[]>>;
