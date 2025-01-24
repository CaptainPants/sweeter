export function arrayRemove<T>(items: T[], value: T) {
    let found = items.indexOf(value);
    while (found >= 0) {
        items.splice(found, 1);
        found = items.indexOf(value);
    }
}
