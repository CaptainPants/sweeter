import { dev } from '@captainpants/sweeter-core';
import { App } from './App.js';

import { createWebRuntime } from '@captainpants/sweeter-web';

dev.enabled = true;

createWebRuntime({
    root: document.getElementById('app')!,
    render: () => <App />,
});
