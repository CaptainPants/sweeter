import { z } from 'zod';

test('test', async () => {
    const num = z
        .number()
        .refine(
            (value) => value >= 3,
            'Value must be greater than or equal to 3',
        )
        .refine((value) => value <= 8, 'Value must be less than or equal to 8');

    expect((await num.safeParseAsync(1)).success).toStrictEqual({
        success: false,
        error: [{ message: 'Value must be greater than or equal to 3' }],
    });
    expect((await num.safeParseAsync(5)).success).toStrictEqual({
        success: true,
        result: 5,
    });
    expect((await num.safeParseAsync(10)).success).toStrictEqual({
        success: false,
        error: [{ message: 'Value must be less than or equal to 8' }],
    });
});
