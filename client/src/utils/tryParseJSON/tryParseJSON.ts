


export const tryParseJSON = <ExpectedValue = never>(
    json: string,
): ExpectedValue | undefined => {
    try {
        return JSON.parse(json) as ExpectedValue;
    } catch (error) {
        return undefined;
    }
};