import { Types } from '../metadata/Types.js';

test('test', async () => {
    const num = Types.number().withValidator(function* (value) {
        if (value < 3) {
            yield 'Value must be greater than or equal to 3';
        }
        if (value > 8) {
            yield 'Value must be less than or equal to 8';
        }
    });

    expect(await num.validate(1)).toStrictEqual({
        success: false,
        error: [{ message: 'Value must be greater than or equal to 3' }],
    });
    expect(await num.validate(5)).toStrictEqual({ success: true, result: 5 });
    expect(await num.validate(10)).toStrictEqual({
        success: false,
        error: [{ message: 'Value must be less than or equal to 8' }],
    });
});
