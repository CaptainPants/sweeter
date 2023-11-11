import { GlobalCssStylesheet } from './GlobalCssStylesheet.js';
import { GlobalCssClass } from './GlobalCssClass.js';

export const styles = {
    class: function (namebasis: string, content: string) {
        return new GlobalCssClass({ nameBasis: namebasis, content });
    },
    global: function (id: string, content: string) {
        return new GlobalCssStylesheet({ id, content });
    },
};
