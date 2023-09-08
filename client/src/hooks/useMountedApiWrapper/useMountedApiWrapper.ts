import { SerializedError } from '@reduxjs/toolkit';
import { CustomQueryError } from '@types';
import { useIsMounted } from 'usehooks-ts';



type Result<T> = {data: T} | {error: CustomQueryError | SerializedError};

export const useMountedApiWrapper = () => {
    const isMounted = useIsMounted();

    const apiWrapper = <T,>(mutation: Promise<Result<T>>, cb: (value: T) => void) => {
        return mutation.then((value) => {
            if (!isMounted()) return;
            if (!('data' in value)) return;

            cb(value.data);
        });
    };

    return {
        apiWrapper,
    };
};