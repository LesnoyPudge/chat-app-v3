


export const tryInside = <_Value>(
    factory: () => _Value,
): _Value | undefined => {
    try {
        return factory();
    } catch (error) {
        return undefined;
    }
}