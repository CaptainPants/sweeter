import { dev } from '@captainpants/sweeter-core';
import { createWebRuntime } from '@captainpants/sweeter-web';

import { App } from './App.js';

import '@captainpants/sweeter-arktype-modeling/extendArkTypes';

dev.enable({ all: true });

createWebRuntime({
    root: document.getElementById('app')!,
    render: () => <App />,
});
