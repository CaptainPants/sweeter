function allSizes<
    TProp extends string,
    TPrefix extends string = '',
    TSuffix extends string = '',
>(
    prop: TProp,
    prefix: TPrefix,
    suffix: TSuffix,
): [
    TProp,
    `${TPrefix}top${TSuffix}`,
    `${TPrefix}right${TSuffix}`,
    `${TPrefix}bottom${TSuffix}`,
    `${TPrefix}left${TSuffix}`,
] {
    return [
        prop,
        `${prefix}top${suffix}`,
        `${prefix}right${suffix}`,
        `${prefix}bottom${suffix}`,
        `${prefix}left${suffix}`,
    ];
}

const pxProperties = [
    'width',
    'height',
    ...allSizes('padding', 'padding-', ''), // padding, padding-*
    ...allSizes('margin', 'margin-', ''), // margin, margin-*
    ...allSizes('border-width', 'border-', '-width'),
] as const; // border-width, padding-*-width

const suffixes: Record<string, string> = {};
for (const item of pxProperties) {
    suffixes[item] = 'px';
}

type NonSuffixedNumericPropertyName = 'opacity';
export type SpecialNumericPropertyName =
    | (typeof pxProperties)[number]
    | NonSuffixedNumericPropertyName;

export function translateNumericPropertyValue(
    property: string,
    value: number,
): string {
    if (value === 0) return '0';

    const suffix = suffixes[property] ?? '';

    return value + suffix;
}
