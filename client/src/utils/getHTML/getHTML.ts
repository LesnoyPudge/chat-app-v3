


export const getHTML = () => {
    return {
        app: document.getElementById('app') as HTMLElement,
        overlay: document.getElementById('overlay') as HTMLElement,
        dev: document.getElementById('dev') as HTMLElement,
    };
};