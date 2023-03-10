import { Descendant } from 'slate';



export const getInitialSlateValue = (text = ''): Descendant[] => {
    return [{
        type: 'paragraph',
        children: [{ text }],
    }];
};