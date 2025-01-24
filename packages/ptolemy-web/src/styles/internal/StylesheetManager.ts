import { type GlobalCssClass } from '../GlobalCssClass.js';
import { getTransitiveReferences } from '../internal/getTransitiveReferences.js';
import { type AbstractGlobalCssStylesheet } from '../types.js';

export class StylesheetManager {
    #document: Document;

    #includedSingletonStylesheetCounts = new WeakMap<
        AbstractGlobalCssStylesheet,
        { count: number; element: HTMLStyleElement }
    >();

    #cssCounter: number = 0;
    #cssClassNameMap: WeakMap<GlobalCssClass, string> = new WeakMap();
    #classNameFormat: (counter: number, className: string) => string;

    constructor(
        document: Document,
        classNameFormat:
            | ((counter: number, className: string) => string)
            | undefined,
    ) {
        this.#document = document;

        this.#classNameFormat =
            classNameFormat ??
            ((counter, className) => `_glbl${counter}_${className}`);
    }

    addStylesheet(stylesheet: AbstractGlobalCssStylesheet): () => void {
        //logger.info(`[include with transitive dependendents] ${stylesheet.id}`);

        const callbacks: (() => void)[] = [];
        //logger.info(`=== Adding stylesheet and dependents ${stylesheet.id}`);

        // Note reverse order so that the depended-on sheets are added first (not that it matters in all likelihood)
        const sheets = getTransitiveReferences(stylesheet).reverse();
        for (const sheet of sheets) {
            callbacks.push(this.#addOneStylesheet(sheet));
        }

        return () => {
            //logger.info(`[include with transitive dependendents] ${stylesheet.id}`);

            // Reverse order
            for (let i = callbacks.length - 1; i >= 0; --i) {
                callbacks[i]!();
            }
        };
    }

    removeStylesheet(stylesheet: AbstractGlobalCssStylesheet): void {
        //logger.info(`[uninclude with transitive dependendents] ${stylesheet.id}`);

        const sheets = getTransitiveReferences(stylesheet);
        for (const sheet of sheets) {
            this.#removeOneStylesheet(sheet);
        }
    }

    #addOneStylesheet(stylesheet: AbstractGlobalCssStylesheet): () => void {
        let entry = this.#includedSingletonStylesheetCounts.get(stylesheet);
        if (!entry) {
            const sheetContent = stylesheet.getContent(this);
            if (!sheetContent) {
                // Shortcut for empty stylesheets, so we don't waste time/ram with DOM elements for them
                return () => {};
            }

            //logger.info(`[inserted] Added stylesheet ${stylesheet.id}`);

            const element = document.createElement('style');
            element.textContent = '\n' + sheetContent;
            element.setAttribute('data-id', stylesheet.id); // not a strictly unique id, just a way of identifying 'which' stylesheet it is
            this.#document.head.appendChild(element);

            entry = {
                count: 0,
                element: element,
            };

            this.#includedSingletonStylesheetCounts.set(stylesheet, entry);
        }

        entry.count += 1;
        //logger.info(`+ref ${stylesheet.id} => ${entry.count}`);

        let removed = false;

        return () => {
            if (removed) {
                return;
            }

            this.#removeOneStylesheet(stylesheet);

            removed = true; // don't do this again;
        };
    }

    #removeOneStylesheet(stylesheet: AbstractGlobalCssStylesheet): void {
        const entry = this.#includedSingletonStylesheetCounts.get(stylesheet);
        if (!entry) {
            // Possible cases:
            // 1) removeStylesheet used without adding first / mismatching number of calls
            // 2) the stylesheet is empty (.content === undefined | '')
            return;
        }

        --entry.count;
        //logger.info(`-ref ${stylesheet.id} => ${entry.count}`);

        if (entry.count === 0) {
            //logger.info(`[removed] Removed stylesheet ${stylesheet.id}`);
            entry.element.remove();
            this.#includedSingletonStylesheetCounts.delete(stylesheet);
        }
    }

    getPrefixedClassName(cssClass: GlobalCssClass): string {
        let name = this.#cssClassNameMap.get(cssClass);
        if (!name) {
            name = this.#classNameFormat(this.#cssCounter, cssClass.className);
            this.#cssClassNameMap.set(cssClass, name);
            ++this.#cssCounter;
        }
        return name;
    }
}
