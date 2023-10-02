import { isHTMLElement } from '@typeGuards';



export const htmlStringToElement = (htmlString: string): HTMLElement | null => {
    const template = document.createElement('template');

    template.innerHTML = htmlString.trim();

    const element = template.content.firstChild;

    if (isHTMLElement(element)) return element;

    return null;
};
