import { throwError } from "./throwError"

it('throwError throws', () => {
    expect(() => throwError(new Error('Example'))).toThrow(new Error('Example'));
})