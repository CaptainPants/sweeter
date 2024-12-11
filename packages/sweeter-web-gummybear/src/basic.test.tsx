import { testRender } from '@captainpants/sweeter-web';

import { button } from './stylesheets/button.js';

it('button style', () => {
    const res = testRender(() => (
        <>
            <button class={button}>Test</button>
        </>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    expect(document.head.innerHTML).toMatchSnapshot();

    res.dispose();
});
