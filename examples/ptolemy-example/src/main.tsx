import { createWebRuntime } from '@serpentis/ptolemy-web';

import { App } from './App.js';

createWebRuntime({
    root: document.getElementById('app')!,
    render: () => <App />,
});
