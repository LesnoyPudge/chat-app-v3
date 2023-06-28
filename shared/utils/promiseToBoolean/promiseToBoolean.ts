


export const promiseToBoolean = (value: Promise<unknown>) => {
    return value.then(() => true).catch(() => false);
};