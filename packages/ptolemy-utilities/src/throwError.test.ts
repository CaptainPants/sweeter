import { throwError } from './throwError.js';

it('throwError throws', () => {
    expect(() => throwError(new Error('Example'))).toThrow(
        new Error('Example'),
    );
});
