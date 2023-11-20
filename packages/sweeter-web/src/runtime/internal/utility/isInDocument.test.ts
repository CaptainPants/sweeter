import { isInDocument } from "./isInDocument.js";

it('basic', () => {
    const ele = document.createElement('div');

    expect(isInDocument(ele)).toStrictEqual(false);

    document.body.appendChild(ele);
    
    expect(isInDocument(ele)).toStrictEqual(true);

    ele.remove();

    expect(isInDocument(ele)).toStrictEqual(false);
});
