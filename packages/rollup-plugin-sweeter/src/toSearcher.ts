
/**
 * Create a reusable function for searching a string for any of a list of substrings. Uses regex.
 * @param names 
 * @returns 
 */
export function toSearcher(names: string[]): ((input: string) => number | undefined) {
    // See https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    const bigOr = names.map(name => name.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');

    if (!bigOr) {
        return () => undefined;
    }

    const regex = new RegExp(bigOr, 'g');

    return (input: string) => {
        const match = input.search(regex);
        return match < 0 ? undefined : match;
    }
}