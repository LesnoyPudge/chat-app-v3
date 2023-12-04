import { RTETypes } from '@components';
import { Descendant, Element, Node } from 'slate';



export const Paragraph = {
    createParagraph: (children: Descendant[]): RTETypes.Elements.Paragraph => {
        return {
            type: 'paragraph',
            children,
        };
    },

    withParagraph: ({ editor }: RTETypes.Helpers.WithEditor) => {
        return editor;
    },

    isParagraph: (node: Node): node is RTETypes.Elements.Paragraph => {
        return Element.isElement(node) && node.type === 'paragraph';
    },
};