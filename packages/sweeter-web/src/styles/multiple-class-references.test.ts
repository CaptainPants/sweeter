import { stylesheet, GlobalCssStylesheet } from './index.js';
import { GlobalCssClass } from './GlobalCssClass.js';

it('Multiple class references produce sane output', () => {
    const classA = new GlobalCssClass({ className: 'ClassA' });
    const classB = new GlobalCssClass({ className: 'ClassB' });

    const sheet = new GlobalCssStylesheet({
        content: stylesheet`
            .${classA} {
                color: red;
            }
            .${classB} {
                color: green;

                &:hover {
                    color: blue;
                }
            }`,
        id: 'test',
    });

    const result = sheet.getContent({
        getPrefixedClassName: (classObject) => classObject.className,
    });

    expect(result).toMatchSnapshot();
});
