export function findProperty(
    obj: object,
    name: string,
): PropertyDescriptor | undefined {
    for (let cur = obj; cur; cur = Object.getPrototypeOf(cur)) {
        const property = Object.getOwnPropertyDescriptor(cur, name);
        if (property) {
            return property;
        }
    }
    return undefined;
}
