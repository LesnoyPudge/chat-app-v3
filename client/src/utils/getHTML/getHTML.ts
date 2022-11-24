


export const getHTML = () => {
    return {
        root: document.getElementById('root') as HTMLElement,
        overlayLayer: document.getElementById('overlay-layer') as HTMLElement,
    };
};