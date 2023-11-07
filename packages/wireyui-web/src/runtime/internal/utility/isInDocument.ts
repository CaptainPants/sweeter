export function isInDocument(node: Node): boolean {
    const targetDocument = node.ownerDocument;

    if (targetDocument === null) {
        throw new Error('Unexpected condition.');
    }

    for (
        let current: Node | null = node;
        current;
        current = current.parentNode
    ) {
        if (current == targetDocument) {
            return true;
        }
    }
    return false;
}
