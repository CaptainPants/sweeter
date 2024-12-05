export type And<Values extends readonly boolean[]> = Values[number] extends true
    ? true
    : false;
