


export const tryParseJSON = <ExpectedValue = unknown>(
    json: string,
): ExpectedValue | undefined => {
    try {
        return JSON.parse(json) as ExpectedValue;
    } catch (error) {
        return undefined;
    }
};