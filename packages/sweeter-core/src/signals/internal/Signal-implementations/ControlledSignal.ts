import { type Signal } from '../../types.js';
import { SignalBase } from './SignalBase.js';
import { type SignalController } from '../../SignalController.js';

export class ControlledSignal<T> extends SignalBase<T> implements Signal<T> {
    constructor(controller: SignalController<T>) {
        super({ mode: 'INITIALISING' });

        controller.addUpdateListener((state) => this._updateAndAnnounce(state));
    }
}
