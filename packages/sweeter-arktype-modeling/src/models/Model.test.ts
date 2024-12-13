import { typeAssert } from '@captainpants/sweeter-utilities';
import { type ArrayModel, type Model } from './Model.js';
import { type Type } from 'arktype';

it('Model<T>', () => {
    typeAssert.equal<Model<Type<number[]>>, ArrayModel<Type<number[]>>>();
});
