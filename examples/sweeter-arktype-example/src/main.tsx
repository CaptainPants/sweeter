import { dev } from '@captainpants/sweeter-core';
import { App } from './App.js';

import { createWebRuntime } from '@captainpants/sweeter-web';
import { extendArkTypes } from '@captainpants/arktype-modeling';

dev.enable({ all: true });
extendArkTypes();

createWebRuntime({
    root: document.getElementById('app')!,
    render: () => <App />,
});
