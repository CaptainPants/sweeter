import { typeAssert } from "@captainpants/sweeter-utilities"
import { ArrayModel, Model } from "./Model";
import { Type } from "arktype";

it('Model<T>', () => {
    typeAssert.equal<
        Model<Type<number[]>>, 
        ArrayModel<Type<number[]>>
    >();
})