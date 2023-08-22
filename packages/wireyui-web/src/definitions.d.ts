
declare global {
    namespace JSX {
        interface IntrinsicElements {
            div: {
                id?: string | undefined;
            };
        }
    }
}