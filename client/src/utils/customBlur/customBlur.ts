


export const customBlur = () => {
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
};