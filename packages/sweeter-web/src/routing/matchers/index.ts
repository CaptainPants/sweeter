
import { StringMatcher } from './StringMatcher.js';

export const matchers = {
    get string() {
        return new StringMatcher();
    } 
};