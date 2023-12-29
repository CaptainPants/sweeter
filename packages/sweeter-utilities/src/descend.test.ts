import { descend } from "./descend.js";

it('General', () => {
    const infinitelyRecursive = (depth: number) => {
        infinitelyRecursive(descend(depth));
    };

    expect(() => {
        infinitelyRecursive(descend.defaultDepth);
    }).toThrow(new Error('Depth limit exceeded'));
});