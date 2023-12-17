import { gridStylesheet } from "./grid.js"

it('Check for unintended changes', () => {
    const result = gridStylesheet.getContent({ getPrefixedClassName: class_ => class_.className });

    expect(result).toMatchSnapshot();
})