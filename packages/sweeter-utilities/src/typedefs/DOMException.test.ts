import { DOMException as Imported } from './DOMException.js';

it('General', () => {
    expect(DOMException).not.toBeUndefined();

    const domEx = new DOMException('Aborted', 'AbortError');

    expect(domEx.code).toStrictEqual(DOMException.ABORT_ERR);

    expect(DOMException.ABORT_ERR).toStrictEqual(20);
});

