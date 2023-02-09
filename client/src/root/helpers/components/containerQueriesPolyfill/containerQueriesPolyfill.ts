


export const containerQueriesPolyfill = () => {
    const supportsContainerQueries = 'container' in document.documentElement.style;
    if (supportsContainerQueries) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return import('container-query-polyfill');
};