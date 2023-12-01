import { App } from "./App.js";

import { createWebRuntime } from "@captainpants/sweeter-web";

createWebRuntime({
    root: document.getElementById('app')!,
    render: () => <App />
})