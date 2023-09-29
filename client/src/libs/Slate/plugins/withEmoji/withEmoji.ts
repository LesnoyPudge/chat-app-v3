import { EmojiCode, emojiCodeList, emojiCodeRegExp } from '@components';
import { Editor, Element, Text, Transforms } from 'slate';
import { CustomEditor } from '../../types';



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
            const [entryNode, entryPath] = entry;

            if (!Text.isText(entryNode)) return normalizeNode(entry);

            const [parentNode] = Editor.parent(editor, entryPath);
            const inParagraph = Element.isElement(parentNode) && parentNode.type === 'paragraph';

            if (!inParagraph) return normalizeNode(entry);

            const nodeText = entryNode.text.toLowerCase();
            const match = nodeText.match(emojiCodeRegExp);

            const noMatch = !match || !match.length;

            if (noMatch) return normalizeNode(entry);

            const emojiCode = match[0] as EmojiCode;

            const matchStart = nodeText.indexOf(emojiCode);
            const matchEnd = matchStart + emojiCode.length;
            const shouldSelect = nodeText.length === matchEnd;

            Transforms.insertNodes(editor, {
                type: 'emoji',
                code: emojiCode,
                children: [{ text: '' }],
            }, {
                at: {
                    anchor: {
                        path: entryPath,
                        offset: matchStart,
                    },
                    focus: {
                        path: entryPath,
                        offset: matchEnd,
                    },
                },
                select: shouldSelect,
            });

            normalizeNode(entry);
        } catch (error) {
            console.log('error caught emoji normalize', error);
            normalizeNode(entry);
        }
    };

    editor.onChange = () => {
        try {
            if (!editor.selection) return onChange();

            const selectedPath = Editor.node(editor, editor.selection)[1];
            const [selectedParentNode] = Editor.parent(editor, selectedPath);

            const isEmoji = Element.isElement(selectedParentNode) && selectedParentNode.type === 'emoji';

            if (!isEmoji) return onChange();

            const moveOperations = editor.operations.filter(operation => operation.type === 'set_selection');
            const moveOperation = moveOperations.at(-1);

            if (!moveOperation || moveOperation.type !== 'set_selection') return onChange();

            const withProp = !!moveOperation.newProperties && !!moveOperation.properties;
            const withAnchor = !!withProp && !!moveOperation.newProperties.anchor && !!moveOperation.properties.anchor;

            if (!withAnchor) return onChange();

            const anchorNew = moveOperation.newProperties.anchor!;
            const anchorOld = moveOperation.properties.anchor!;

            const isMoveBackward = anchorNew.path[1] < anchorOld.path[1];

            Transforms.move(editor, { reverse: isMoveBackward });

            onChange();
        } catch (error) {
            console.log('error caught emoji onchange', error);
            onChange();
        }
    };

    return editor;
};