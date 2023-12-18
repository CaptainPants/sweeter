

import { depthFirstSearch } from './depthFirstSearch.js';

interface Node {
    value: number;
    children: Node[];
}

test('searches in correct order', async () => {
    const tree: Node[] = [
        {
            value: 1,
            children: [
                {
                    value: 2,
                    children: [],
                },
                {
                    value: 3,
                    children: [
                        {
                            value: 4,
                            children: [],
                        },
                        {
                            value: 5,
                            children: [],
                        },
                        {
                            value: 6,
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            value: 7,
            children: [],
        },
    ];

    const result: number[] = [];

    depthFirstSearch(
        tree,
        (node) => node.children,
        (node) => {
            result.push(node.value);
            return undefined;
        },
    );

    expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
});
