
import '@captainpants/sweeter-arktype-modeling/extendArkTypes';

import { dev } from '@captainpants/sweeter-core';
import { App } from './App.js';

import { createWebRuntime } from '@captainpants/sweeter-web';

dev.enable({ all: true });

createWebRuntime({
    root: document.getElementById('app')!,
    render: () => <App />,
});
