import { type Context } from './Context.js';

export type ContextSnapshot = <T>(context: Context<T>) => T;
