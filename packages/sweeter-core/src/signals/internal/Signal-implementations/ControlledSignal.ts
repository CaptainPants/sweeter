import { type SignalState, type Signal } from '../../types.js';
import { SignalBase } from './SignalBase.js';
import { type SignalController } from '../../SignalController.js';

export class ControlledSignal<T> extends SignalBase<T> implements Signal<T> {
    constructor(
        controller: SignalController<T>,
        startingState?: SignalState<T>,
    ) {
        super(startingState ?? { mode: 'INITIALISING' });

        const listener = (newState: SignalState<T>) =>
            this._updateAndAnnounce(newState);
        controller.addUpdateListener(listener);
    }
}
