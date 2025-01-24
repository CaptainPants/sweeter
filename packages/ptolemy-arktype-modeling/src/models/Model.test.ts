import { type Type } from 'arktype';

import { typeAssert } from '@serpentis/ptolemy-utilities';

import { type ArrayModel, type Model } from './Model.js';

it('Model<T>', () => {
    typeAssert.equal<Model<Type<number[]>>, ArrayModel<Type<number[]>>>();
});
