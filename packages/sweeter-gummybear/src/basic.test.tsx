import { testRender } from '@captainpants/sweeter-web';

import { forms } from './stylesheets/index.js';

it('button style', () => {
    // This test just stops jest from complaining until we add some unit tests

    // TODO: GlobalCssClasses should be automatically added while they are referenced
    const res = testRender(() => (
        <>
            <button class={forms.button}>Test</button>
        </>
    ));

    expect(res.getHTML()).toMatchSnapshot();

    expect(document.head.innerHTML).toMatchSnapshot();

    res.dispose();
});
