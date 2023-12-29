import { isAbortError } from "./isAbortError.js";

it('General', () => {
    expect(isAbortError(new Error('Test'))).toStrictEqual(false);

    expect(isAbortError(new DOMException('Test'))).toStrictEqual(false);

    expect(isAbortError(new DOMException('Test', 'AbortError'))).toStrictEqual(true);
});