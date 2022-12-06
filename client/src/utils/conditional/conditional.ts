


export const conditional = <T, F>(trueState: T, falseState: F, condition: boolean) => {
    return condition ? trueState : falseState;
};