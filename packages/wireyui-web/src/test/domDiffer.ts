
type ElementPartial<TElement> = Partial<TElement> & { children?: ElementPartial<TElement>[] };

export function expectDOMMatching<TElement extends HTMLElement | SVGElement | Text>(
    node: TElement,
    target: ElementPartial<TElement>,
): string | null {
    for (const key of Object.getOwnPropertyNames(target)) {
        if (key === 'children') {
            continue;
        }

        expect((node as unknown as Record<string, unknown>)[key]).toStrictEqual((target as Record<string, unknown>)[key])
    }

    if (target.children) { 
        
        const childPartials = target.children;
        const childNodes = node.childNodes;
        
        expect(childNodes.length).toStrictEqual(childPartials.length);

        childPartials.forEach(
            (childPartial, index) => {
                const childNode = childNodes[index]!
                expectDOMMatching(childNode as HTMLElement | SVGElement | Text, childPartial);
            }
        )
    }
    else {
        expect(node.childNodes.length).toStrictEqual(0);
    }

    return null;
}

// function deepEquals<T>(a: T, b: T): boolean {
//     if (a === null) {
//         return b === a;
//     }

//     if (Array.isArray(a)) {
//         if (!Array.isArray(b)) return false;
//         if (a.length !== b.length) return false;

//         return a.every((aItem, index, list) => deepEquals(aItem, b[index]));
//     }

//     if (typeof a === 'object') {
//         const aKeys = Object.getOwnPropertyNames(a).sort();
//         const bKeys = Object.getOwnPropertyNames(b).sort();

//         if (!deepEquals(aKeys, bKeys)) return false;

//         for (const key in aKeys) {
//             if (
//                 !deepEquals(
//                     (a as Record<string, unknown>)[key],
//                     (b as Record<string, unknown>)[key],
//                 )
//             ) {
//                 return false;
//             }
//         }

//         return true;
//     }

//     return Object.is(a, b);
// }
