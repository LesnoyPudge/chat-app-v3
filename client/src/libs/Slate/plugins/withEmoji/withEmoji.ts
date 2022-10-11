import { Editor, Element, Text, Transforms } from 'slate';
import { ReactEditor, Slate } from 'slate-react';
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
        const match = Text.isText(node) && node.text.match(/:[a-zA-Z]+:/gm);

        if (!match) return normalizeNode(entry);
        const emojiCode = match[0];

        Transforms.insertNodes(
            editor, 
            {
                type: 'emoji',
                code: ':poop:', //emojiCode
                children: [{ text: '' }],
            }, 
            { 
                at: {
                    path,
                    offset: node.text.indexOf(emojiCode) + emojiCode.length,
                },
            },
        );

        Transforms.delete(editor, {
            at: {
                path,
                offset: node.text.indexOf(emojiCode),
            },
            distance: emojiCode.length,
        });

        setTimeout(() => {
            Transforms.select(editor, { offset: 0, path: [path[0], path[1] + 2] });
        });
    };

    editor.onChange = () => {
        const moveOperation = editor.operations.find(operation => operation.type === 'set_selection');
        if (moveOperation && moveOperation.type === 'set_selection') {
            if (moveOperation.newProperties && moveOperation.properties) {
                if (moveOperation.newProperties.anchor && moveOperation.properties.anchor) {
                    const node = Editor.node(editor, { 
                        path: moveOperation.newProperties.anchor.path, 
                        offset: moveOperation.newProperties.anchor.offset,
                    });
                    
                    const line = editor.children[node[1][0]] as CustomElement;
                    const elem = line.children[node[1][1]] as unknown as CustomElement | CustomText;

                    if (!Text.isText(elem) && elem.type === 'emoji') {
                        const isMoveBackward = 
                            moveOperation.newProperties.anchor.path[1] 
                            < 
                            moveOperation.properties.anchor.path[1];
                        console.log(moveOperation, isMoveBackward ? 'back' : 'forward', elem);
                        Transforms.move(editor, { reverse: isMoveBackward });
                    }
                }
            }
        }
        
        onChange();
    };

    return editor;
};