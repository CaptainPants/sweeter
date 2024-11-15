
export type Or<Values extends readonly boolean[]> = Values[number] extends false ? false : true;
