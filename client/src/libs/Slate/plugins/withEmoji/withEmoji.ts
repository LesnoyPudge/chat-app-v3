import { BasePoint, Editor, Element, Text, Transforms } from 'slate';
import { emojiCodeList, EmojiCodeType } from '../../components';
import { CustomEditor, CustomElement, CustomText } from '../../types';



export const withEmoji = (editor: CustomEditor) => {
    const { isVoid, isInline, normalizeNode, onChange } = editor;
  
    editor.isVoid = (element) => {
        return element.type === 'emoji' ? true : isVoid(element);
    };
  
    editor.isInline = (element) => {
        return element.type === 'emoji' ? true : isInline(element);
    };

    editor.normalizeNode = (entry) => {
        const [node, path] = entry;
        const parent = Text.isText(node) && Editor.parent(editor, path);
        const isParagraph = parent && Element.isElement(parent[0]) && parent[0].type === 'paragraph';
        const match = Text.isText(node) && node.text.match(/:[a-zA-Z]+:/gm);
        
        if (!match) return normalizeNode(entry);
        if (!isParagraph) return normalizeNode(entry);

        const validEmojiMatchList = match.filter((item) => {
            return emojiCodeList.includes(item.toLowerCase() as EmojiCodeType);
        });
        if (!validEmojiMatchList.length) return normalizeNode(entry);

        const emojiCode = validEmojiMatchList[0] as EmojiCodeType;

        Transforms.wrapNodes(
            editor,
            {
                type: 'emoji',
                code: emojiCode,
                children: [{ text: '' }], 
            },
            {
                at: {
                    anchor: {
                        path,
                        offset: node.text.indexOf(emojiCode),
                    },
                    focus: {
                        path,
                        offset: node.text.indexOf(emojiCode) + emojiCode.length,
                    },
                },
                split: true,
                match: (node, path) => {
                    const parent = Text.isText(node) && Editor.parent(editor, path);
                    return parent && Element.isElement(parent[0]) && parent[0].type === 'paragraph';
                },
            },
        );

        normalizeNode(entry);
    };

    editor.onChange = () => {
        const moveOperation = editor.operations.find(operation => operation.type === 'set_selection');
        const isFound = !!(moveOperation && moveOperation.type === 'set_selection');
        const withProp = !!(isFound && moveOperation.newProperties && moveOperation.properties);
        const withAnchor = !!(withProp && moveOperation.newProperties.anchor && moveOperation.properties.anchor);

        if (!withAnchor) return onChange();

        const anchorNew = moveOperation.newProperties.anchor as BasePoint;
        const anchorOld = moveOperation.properties.anchor as BasePoint;
        const nodePath = Editor.node(editor, { path: anchorNew.path, offset: anchorNew.offset })[1];
        const line = editor.children[nodePath[0]] as CustomElement;
        const element = line.children[nodePath[1]] as unknown as CustomElement | CustomText;
        const isEmoji = !Text.isText(element) && element.type === 'emoji';

        if (!isEmoji) return onChange();

        const isMoveBackward = anchorNew.path[1] < anchorOld.path[1];
        Transforms.move(editor, { reverse: isMoveBackward }); 
        
        onChange();
    };

    return editor;
};