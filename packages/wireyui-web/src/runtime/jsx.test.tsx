import type { TypeMatchAssert } from "@captainpants/wireyui-core";
import { jsx } from "./jsx.js";

it('basic div creates with props', () => {
    const div = jsx('div', { children: ["test", "content"], class: 'test' });

    // Confirm the result is a div, its nice to make sure that jsx() gives strongly typed results.
    const _typeAssert1: TypeMatchAssert<HTMLDivElement, typeof div> = true;

    expect(div).toBeInstanceOf(HTMLDivElement);

    expect(div.className).toStrictEqual('test');

    expect(div.childNodes.length).toStrictEqual(2);

    expect(div.childNodes[0]).toBeInstanceOf(Text);
    expect((div.childNodes[0] as Text).textContent).toStrictEqual('test');

    expect(div.childNodes[1]).toBeInstanceOf(Text);
    expect((div.childNodes[1] as Text).textContent).toStrictEqual('content');
})