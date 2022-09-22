






const fallback = (text: string) => {
    const previousFocusElement = document.activeElement as HTMLElement;
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.visibility = 'hidden';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    previousFocusElement && previousFocusElement.focus();
};

export const copyToClipboard = (text: string) => {
    if (!navigator.clipboard) return fallback(text);
        
    navigator.clipboard.writeText(text).catch(() => fallback(text));
};