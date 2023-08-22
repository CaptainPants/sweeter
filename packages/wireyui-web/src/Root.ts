
/**
 * Placeholder interface for future options to be provided to the root.
 */
export interface RootOptions {

}

export class Root{
    #options: RootOptions;

    constructor(options?: RootOptions) {
        this.#options = options ?? {};
    }


    render(element: HTMLElement, rootComponent: JSX.Element) {
        throw 'Test';
    }
}