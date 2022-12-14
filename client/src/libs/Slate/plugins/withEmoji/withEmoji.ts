import { EmojiCode, emojiCodeList } from '@components';
import { BasePoint, Editor, Element, Text, Transforms } from 'slate';
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
        try {
            const [node, path] = entry;

            if (!Text.isText(node)) return normalizeNode(entry);

            const parent = Editor.parent(editor, path);
            const isParagraph = parent && Element.isElement(parent[0]) && parent[0].type === 'paragraph';

            if (!isParagraph) return normalizeNode(entry);

            const regExpString = emojiCodeList.map(code => code.replace(/[^a-zA-Z]/g, '\\$&')).join('|');
            const emojiCodeRegExp = new RegExp(regExpString);
            const nodeText = node.text.toLowerCase();
            const match = nodeText.toLowerCase().match(emojiCodeRegExp);
  
            if (!match || !match.length) return normalizeNode(entry);

            const emojiCode = match[0].toLowerCase() as EmojiCode;

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
                            offset: nodeText.indexOf(emojiCode),
                        },
                        focus: {
                            path,
                            offset: nodeText.indexOf(emojiCode) + emojiCode.length,
                        },
                    },
                    split: true,
                },
            );

            normalizeNode(entry);
        } catch (error) {
            console.log('error cautgh emoji normalize');
        }
    };

    editor.onChange = () => {
        try {
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
        } catch (error) {
            console.log('error cautgh emoji onchange');
        }
    };

    return editor;
};