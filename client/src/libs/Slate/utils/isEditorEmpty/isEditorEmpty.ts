import { Descendant, Text, Element } from 'slate';



export const isEditorEmpty = (value: Descendant[]): boolean => {
    const nonEmptyNodes = value.filter((node) => {
        if (Element.isElement(node) && node.type === 'emoji') {
            return true;
        }
    
        if (Text.isText(node) && node.text.trim() !== '') {
            return true;
        }
    
        if (Element.isElement(node) && !isEditorEmpty(node.children)) {
            return true;
        }
    
        return false;
    });
    
    return nonEmptyNodes.length === 0;
};