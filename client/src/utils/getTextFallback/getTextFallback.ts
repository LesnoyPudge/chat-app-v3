


export const getTextFallback = (
    text?: string,
    fallback = 'Загрузка...',
) => {
    return text ?? fallback;
};