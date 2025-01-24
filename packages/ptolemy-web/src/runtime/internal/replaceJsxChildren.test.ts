import { replaceJsxChildren } from './replaceJsxChildren.js';

it('General', () => {
    const nodes1 = [
        document.createElement('u'),
        document.createElement('strong'),
        document.createElement('em'),
    ];

    const holder = document.createElement('div');

    replaceJsxChildren(holder, nodes1);

    expect(holder.outerHTML).toMatchSnapshot();

    const nodes2 = [nodes1[1]!, nodes1[0]!, nodes1[2]!];

    replaceJsxChildren(holder, nodes2);

    expect(holder.outerHTML).toMatchSnapshot();
});
