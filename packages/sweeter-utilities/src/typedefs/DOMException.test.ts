
import { DOMException as Imported } from "./DOMException.js";

it('General', () => {
    expect(DOMException).not.toBeUndefined();

    const domEx = new DOMException('Aborted', 'AbortError');

    expect(domEx.code).toStrictEqual(DOMException.ABORT_ERR);
    
    expect(DOMException.ABORT_ERR).toStrictEqual(20);
});

it('General', () => {
    expect(Imported).toStrictEqual(DOMException);

    expect(Imported).not.toBeUndefined();

    const domEx = new Imported('Aborted', 'AbortError');

    expect(domEx.code).toStrictEqual(Imported.ABORT_ERR);
    
    expect(Imported.ABORT_ERR).toStrictEqual(20);
});