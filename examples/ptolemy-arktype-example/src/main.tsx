import { dev } from '@serpentis/ptolemy-core';
import { createWebRuntime } from '@serpentis/ptolemy-web';

import { App } from './App.js';

import '@serpentis/ptolemy-arktype-modeling/extendArkTypes';

dev.enable({ all: true });

createWebRuntime({
    root: document.getElementById('app')!,
    render: () => <App />,
});
