


export const getTextFallback = (
    text: string | undefined,
    fallback = 'Загрузка...',
) => {
    return text ?? fallback;
};