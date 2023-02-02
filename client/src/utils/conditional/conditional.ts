


type Return<T, F, COND> = COND extends true ? T : F;

export const conditional = <T, F, COND extends boolean>(
    trueState: T, 
    falseState: F, 
    condition: COND,
): Return<T, F, COND> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return condition ? trueState : falseState;
};