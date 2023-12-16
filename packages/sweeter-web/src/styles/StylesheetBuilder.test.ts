import { StylesheetBuilder } from "./StylesheetBuilder.js";
import { stylesheet } from "./stylesheet.js";

it('Circular dependency works', () => {
    const builder = new StylesheetBuilder();

    builder.append('a').append('b').append(stylesheet`c`);

    const built = builder.build();

    const asString = built({ getPrefixedClassName: thing => thing.className })

    expect(asString).toMatchSnapshot();
});