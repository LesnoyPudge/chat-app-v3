


export const containerQueriesPolyfill = () => {
    const isSupported = 'container' in document.documentElement.style;
    if (isSupported) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return import('container-query-polyfill');
};