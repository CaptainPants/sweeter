export function isInDocument(node: Node, targetDocument: Document): boolean {
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
