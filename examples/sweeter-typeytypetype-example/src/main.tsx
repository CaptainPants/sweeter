import { dev } from '@captainpants/sweeter-core';
import { App } from './App.js';

import { createWebRuntime } from '@captainpants/sweeter-web';

dev.enable(true, true);

createWebRuntime({
    root: document.getElementById('app')!,
    render: () => <App />,
});
