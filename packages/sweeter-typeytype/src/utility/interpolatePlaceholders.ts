const regex = /{([^:}]+)(?::([^}]*))?}/gi;

function defaultFormat(value: unknown, _format: string | null): string {
    return String(value);
}

export function interpolatePlaceholders(
    template: string | string | null,
    args: unknown[] | undefined,
    formatCallback = defaultFormat,
): string {
    return (template ?? '').replace(
        regex,
        (
            substring,
            indexString: string,
            format: string | undefined,
        ): string => {
            const index = Number(indexString);
            if (
                isNaN(index) ||
                args === undefined ||
                index < 0 ||
                index >= args.length
            ) {
                return substring;
            }
            return formatCallback(args[index], format ?? null);
        },
    );
}
