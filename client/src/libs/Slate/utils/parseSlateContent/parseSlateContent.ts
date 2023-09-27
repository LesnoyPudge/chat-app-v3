import { getInitialSlateValue, isDescendantArray } from '@libs';



const tryParseJSON = (json: string): unknown | undefined => {
    try {
        return JSON.parse(json);
    } catch (error) {
        return undefined;
    }
};

const fallbackValue = getInitialSlateValue();

export const parseSlateContent = (content: string) => {
    const parsedContent = tryParseJSON(content);

    if (!isDescendantArray(parsedContent)) return fallbackValue;

    return parsedContent;
};