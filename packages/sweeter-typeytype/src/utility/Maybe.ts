export type Maybe<TResult, TError = string | Error> =
    | {
          success: true;
          result: TResult;
      }
    | {
          success: false;
          error: TError;
      };

// eslint-disable-next-line @typescript-eslint/no-redeclare -- Using typescripts declaration merging magic here.
export const Maybe = {
    error: <TResult, TError>(error: TError): Maybe<TResult, TError> => {
        return {
            success: false,
            error,
        };
    },
    success: <TResult, TError>(result: TResult): Maybe<TResult, TError> => {
        return {
            success: true,
            result,
        };
    },
};
