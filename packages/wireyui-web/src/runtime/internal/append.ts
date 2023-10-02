export function append(parent: Node, after: Node | null, child: Node): Node {
    if (after) {
        parent.insertBefore(child, after.nextSibling);
    } else {
        parent.appendChild(child);
    }
    return child;
}
