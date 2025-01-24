import { removeSelfAndLaterSiblings } from './removeSelfAndLaterSiblings.js';

it('test', () => {
    const item1 = document.createElement('div');
    item1.textContent = 'item-1';
    const item2 = document.createElement('div');
    item2.textContent = 'item-2';
    const item3 = document.createElement('div');
    item3.textContent = 'item-3';

    const parent = document.createElement('div');
    parent.appendChild(item1);
    parent.appendChild(item2);
    parent.appendChild(item3);

    removeSelfAndLaterSiblings(item2, () => {});

    expect(item1.parentNode).toStrictEqual(parent);
    expect(item2.parentNode).toStrictEqual(null);
    expect(item3.parentNode).toStrictEqual(null);

    expect(parent.outerHTML).toStrictEqual('<div><div>item-1</div></div>');
});
