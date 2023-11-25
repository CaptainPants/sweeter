/* @jsxImportSource ../.. */

import { testRender } from '../../test/testRender.js';
import { GlobalCssClass } from '../../styles/GlobalCssClass.js';

const class_ = new GlobalCssClass({
    className: 'Test1',
    content: `
        color: green;

        &:hover {
            color: red;
        }
    `,
});

it('added and removed', () => {
    const res = testRender(() => <div class={class_}>TEXT</div>);

    // class 'class_' should have been added to the document.head
    expect(document.head.outerHTML).toMatchSnapshot();

    res.dispose();

    // now it should have been removed
    expect(document.head.outerHTML).toMatchSnapshot();
});
