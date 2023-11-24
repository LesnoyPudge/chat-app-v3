import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { BaseEditor, BaseElement, BaseOperation, BaseSelection, BaseText, createEditor, Descendant, Editor, Element, Node, NodeEntry, Point, Range, Text, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { Slate, withReact, Editable as ContentEditable, ReactEditor, RenderElementProps, useSlate, RenderLeafProps } from 'slate-react';
import { isKeyHotkey } from 'is-hotkey';
import { JSONView } from '@dev';
import { logger } from '@utils';
import { Key } from 'ts-key-enum';



export module RTETypes {
    export type Editor = (
        BaseEditor &
        ReactEditor &
        HistoryEditor
    );

    export type Paragraph = BaseElement & {
        type: 'paragraph';
    }

    export type Link<T extends string = string> = {
        type: 'link';
        url: string;
        children: [Text<T>];
    }

    export type Emoji<T extends string = string> = {
        type: 'emoji';
        code: T;
        children: [Text<T>];
    }

    export type Element = (
        Paragraph |
        Link |
        Emoji
    );

    export type Text<T extends string = string> = {
        text: T;
        bold?: boolean;
        italic?: boolean;
    }

    export type SlateCustomTypes = {
        Editor: RTETypes.Editor;
        Element: RTETypes.Element;
        Text: RTETypes.Text;
    }
}


declare module 'slate' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface CustomTypes extends RTETypes.SlateCustomTypes {}
}

type WithEditor<T extends object = object> = T & {
    editor: Editor;
}

type WithCharacterLimit = {
    maxLength: number;
}

const RTEModules = {
    CharacterLimit: {
        withCharacterLimit: ({ editor, maxLength }: WithEditor<WithCharacterLimit>) => {
            const { onChange } = editor;

            const getNumberOfCharsToDelete = () => {
                const text = Editor.string(editor, [], { voids: true });
                return text.length - maxLength;
            };

            const next = () => {
                const left = getNumberOfCharsToDelete();
                if (left > 0) return deleteLoop(left);
            };

            const deleteLoop = (charsLeft: number): void => {
                const lastEntry = Editor.last(editor, []);

                const isSimpleText = RTEModules.Text.isSimpleText(editor, lastEntry);
                if (isSimpleText) {
                    const [lastNode, lastPath] = lastEntry;

                    if (lastNode.text.length >= charsLeft) {
                        Transforms.delete(editor, {
                            at: {
                                path: lastPath,
                                offset: lastNode.text.length,
                            },
                            distance: charsLeft,
                            reverse: true,
                            unit: 'character',
                        });

                        return next();
                    }

                    Transforms.removeNodes(editor, {
                        at: lastPath,
                    });

                    return next();
                }

                const isEditableElementText = RTEModules.Text.isEditableElementText(
                    editor,
                    lastEntry,
                );
                if (isEditableElementText) {
                    const [lastNode, lastPath] = lastEntry;

                    if (lastNode.text.length >= charsLeft) {
                        Transforms.delete(editor, {
                            at: {
                                path: lastPath,
                                offset: lastNode.text.length,
                            },
                            distance: charsLeft,
                            reverse: true,
                            unit: 'character',
                        });

                        return next();
                    }

                    const parentEntry = Editor.parent(editor, lastPath);

                    Transforms.removeNodes(editor, {
                        at: parentEntry[1],
                        voids: true,
                    });

                    return next();
                }

                const isReadOnlyElementText = RTEModules.Text.isReadOnlyElementText(
                    editor,
                    lastEntry,
                );
                if (isReadOnlyElementText) {
                    const [_, lastPath] = lastEntry;
                    const [__, parentPath] = Editor.parent(editor, lastPath);

                    Transforms.removeNodes(editor, {
                        at: parentPath,
                        voids: true,
                    });

                    return next();
                }

                logger.log('character limit deletion is not handled');
            };

            // editor.onChange = (operation) => {
            //     const op = operation?.operation;

            //     if (!(
            //         op?.type === 'insert_text' ||
            //         op?.type === 'insert_node'
            //     )) return onChange(operation);

            //     const charsToDelete = getNumberOfCharsToDelete();
            //     if (charsToDelete <= 0) return onChange(operation);

            //     Editor.withoutNormalizing(editor, () => {
            //         deleteLoop(charsToDelete);
            //     });

            //     return onChange(operation);
            // };





            return editor;
        },
    },

    Paragraph: {
        createParagraph: (children: Descendant[]): RTETypes.Paragraph => {
            return {
                type: 'paragraph',
                children,
            };
        },

        isParagraph: (node: Node): node is RTETypes.Paragraph => {
            return Element.isElement(node) && node.type === 'paragraph';
        },
    },

    Text: {
        createText: (text: string): Text => {
            return {
                text,
            };
        },

        isSimpleText: (
            editor: Editor,
            nodeEntry: NodeEntry,
        ): nodeEntry is NodeEntry<Text> => {
            return (
                Text.isText(nodeEntry[0]) &&
                RTEModules.Paragraph.isParagraph(
                    Editor.parent(editor, nodeEntry[1])[0],
                )
            );
        },

        isEditableElementText: (
            editor: Editor,
            nodeEntry: NodeEntry,
        ): nodeEntry is NodeEntry<Text> => {
            if (!Text.isText(nodeEntry[0])) return false;

            const parent = Editor.parent(editor, nodeEntry[1])[0];

            if (!Element.isElement(parent)) return false;

            return !Editor.isElementReadOnly(editor, parent);
        },

        isReadOnlyElementText: (
            editor: Editor,
            nodeEntry: NodeEntry,
        ): nodeEntry is NodeEntry<Text> => {
            if (!Text.isText(nodeEntry[0])) return false;

            const parent = Editor.parent(editor, nodeEntry[1])[0];

            if (!Element.isElement(parent)) return false;

            return Editor.isElementReadOnly(editor, parent);
        },
    },

    Emoji: {
        createEmoji: (code: string): RTETypes.Emoji => {
            return {
                type: 'emoji',
                code,
                children: [
                    RTEModules.Text.createText(code),
                ],
            };
        },

        isEmoji: (node: Node): node is RTETypes.Emoji => {
            return Element.isElement(node) && node.type === 'emoji';
        },

        withEmoji: ({ editor }: WithEditor) => {
            const {
                isInline, isElementReadOnly, isSelectable,
                isVoid, setSelection, normalizeNode,
            } = editor;

            editor.isInline = (element) => {
                return RTEModules.Emoji.isEmoji(element) || isInline(element);
            };

            editor.isElementReadOnly = (element) => {
                return RTEModules.Emoji.isEmoji(element) || isElementReadOnly(element);
            };

            editor.isSelectable = (element) => {
                return RTEModules.Emoji.isEmoji(element) ? false : isSelectable(element);
            };

            editor.isVoid = (element) => {
                return RTEModules.Emoji.isEmoji(element) || isVoid(element);
            };

            editor.setSelection = (selection) => {
                // console.log('sel try');
                if (!Range.isRange(selection)) return setSelection(selection);
                // console.log('setSelection', Math.random());
                const nodeEntry = Editor.node(editor, selection);
                const [node, path] = nodeEntry;
                // console.log('sel node', JSON.stringify(node), selection);


                // if (JSON.stringify(node) === '{"text":""}') {
                //     console.log('');
                // }

                if (
                    RTEModules.Text.isSimpleText(editor, nodeEntry) ||
                    RTEModules.Text.isEditableElementText(editor, nodeEntry) ||
                    RTEModules.Paragraph.isParagraph(node)
                ) return setSelection(selection);

                if (RTEModules.Text.isReadOnlyElementText(editor, nodeEntry)) {
                    const [_, parentPath] = Editor.parent(editor, path);

                    const nextEntry = Editor.next(editor, {
                        at: parentPath,
                        match: (mn, mp) => RTEModules.Text.isSimpleText(editor, [mn, mp]),
                    }) ?? Editor.last(editor, []);


                    Transforms.select(editor, nextEntry[1]);
                    Transforms.collapse(editor);

                    return;
                }

                logger.error('no selection handler match', node);

                return setSelection(selection);
            };


            const { mergeNodes } = editor;
            editor.mergeNodes = (opt = {}) => {
                return mergeNodes(opt);
            };

            editor.normalizeNode = (entry, options) => {



                return normalizeNode(entry, options);
            };

            const { move } = editor;
            editor.move = (options) => {
                // console.log('move', options);
                return move(options);
            };

            const { collapse } = editor;
            editor.collapse = (options) => {
                // console.log('collapse', options);
                return collapse(options);
            };

            const { select } = editor;
            editor.select = (target) => {
                // console.log('select', JSON.stringify(target));
                return select(target);
            };


            const { apply } = editor;
            editor.apply = (op) => {
                // console.log(op);
                return apply(op);
            };

            const { range } = editor;
            editor.range = (at, to) => {
                // console.log('range', JSON.stringify(at), JSON.stringify(to));
                return range(at, to);
            };







            const { positions } = editor;
            editor.positions = (o) => {
                // console.log('positions', Math.random());
                return positions(o);
            };

            const { unhangRange } = editor;
            editor.unhangRange = (range, options) => {
                // console.log('unhangRange', Math.random());
                return unhangRange(range, options);
            };

            const { insertNodes } = editor;
            editor.insertNodes = (n, o) => {
                const nodes = (Array.isArray(n) ? n : [n]).filter((node) => {
                    return !Text.isText(node);
                });
                // console.log('ins', o);
                return insertNodes(n, o);
            };

            const { insertText } = editor;
            editor.insertText = (n, o) => {

                // console.log('it', n);
                return insertText(n, o);
            };

            return editor;
        },
    },
};

type EditorCreatorOptions = (
    WithCharacterLimit
);

const createEditorWithPlugins = ({
    maxLength,
}: EditorCreatorOptions) => {
    let editor = createEditor();

    editor = withHistory(editor);
    editor = withReact(editor);
    editor = RTEModules.CharacterLimit.withCharacterLimit({ editor, maxLength });
    editor = RTEModules.Emoji.withEmoji({ editor });

    return editor;
};

const createInitialValue = (): Descendant[] => {
    return [
        RTEModules.Paragraph.createParagraph([
            RTEModules.Text.createText('some text '),
            RTEModules.Emoji.createEmoji(':poop:'),
            RTEModules.Text.createText(''),
            RTEModules.Emoji.createEmoji(':poop:'),
            RTEModules.Text.createText(''),
            RTEModules.Emoji.createEmoji(':poop:'),
            RTEModules.Text.createText(''),
        ]),
    ];
};

export const RichTextEditorV3 = (() => {
    const Container: FC<PropsWithChildren> = ({ children }) => {
        const editor = useMemo(() => createEditorWithPlugins({
            maxLength: 20,
        }), []);

        const [value, setValue] = useState(() => createInitialValue());

        return (
            <Slate
                editor={editor}
                initialValue={value}
                onValueChange={setValue}
                onSelectionChange={(selection) => {
                    // console.log(editor.node(selection.))
                    // if (!selection) return;
                    // const selectedNode = editor.selection && Editor.node(editor, selection.focus);
                    // console.log(JSON.stringify(selectedNode));
                }}
                key={''}
            >
                {children}
            </Slate>
        );
    };

    const InlineChromiumBugfix: FC = () => (
        <span
            contentEditable={false}
            className='text-[0px]'
        >
            {String.fromCodePoint(160) /* Non-breaking space */}
        </span>
    );

    const Editable: FC = () => {
        const editor = useSlate();

        const renderElement = useCallback(({
            attributes,
            children,
            element,
        }: RenderElementProps) => {
            switch (element.type) {
                case 'emoji':
                    return (
                        <span
                            className='inline-block text-rose-500 mx-1'
                            data-emoji={element.code}
                            {...attributes}
                            contentEditable={false}
                        >
                            {children}

                            <span contentEditable={false}>


                                <>{element.code}</>
                            </span>
                        </span>
                    );

                case 'paragraph':
                    return (
                        <p {...attributes}>
                            {children}
                        </p>
                    );

                case 'link':
                    return (
                        <span
                            className='text-color-link'
                            data-url={element.url}
                            {...attributes}
                        >
                            {children}
                        </span>
                    );

                default:
                    logger.error('unhandled rendering element type');
                    break;
            }
        }, []);

        const renderLeaf = useCallback((props: RenderLeafProps) => {
            const { attributes, children, leaf } = props;

            return (
                <span
                // The following is a workaround for a Chromium bug where,
                // if you have an inline at the end of a block,
                // clicking the end of a block puts the cursor inside the inline
                // instead of inside the final {text: ''} node
                // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
                    // className='px-[0.1px]'
                    {...attributes}
                >
                    {children}
                </span>
            );
        }, []);

        return (
            <>
                <ContentEditable
                    renderElement={renderElement}
                    // renderPlaceholder={}
                    renderLeaf={renderLeaf}
                    onContextMenu={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {

                        // Default left/right behavior is unit:'character'.
                        // This fails to distinguish between two cursor positions, such as
                        // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
                        // Here we modify the behavior to unit:'offset'.
                        // This lets the user step into and out of the inline without stepping over characters.
                        // You may wish to customize this further to only use unit:'offset' in specific cases.
                        // if (e.key === 'ArrowLeft') {
                        //     try {
                        //         throw new Error('');

                        //     } catch (error) {

                        //     }
                        // }

                        // return;

                        if (!editor.selection) return;

                        // if (!(
                        //     e.key === Key.ArrowLeft ||
                        //     e.key === Key.ArrowRight
                        // )) return;

                        if (isKeyHotkey('shift+left', e.nativeEvent)) {
                            e.preventDefault();
                            console.log('handle shift left');

                            Transforms.move(editor, {
                                unit: 'offset',
                                reverse: true,
                                edge: 'focus',
                            });
                        }


                        if (isKeyHotkey('shift+right', e.nativeEvent)) {
                            e.preventDefault();
                            console.log('handle shift right');

                            Transforms.move(editor, {
                                unit: 'offset',
                                reverse: false,
                                edge: 'focus',
                            });
                        }

                        // if (e.key === 'ArrowRight') {
                        //     e.preventDefault();
                        // Transforms.move(editor, {
                        //     unit: 'line',
                        //     edge: 'focus',
                        // });
                        // }

                        if (Range.isCollapsed(editor.selection)) {
                            if (isKeyHotkey('left', e.nativeEvent)) {
                                e.preventDefault();
                                Transforms.move(editor, { unit: 'offset', reverse: true });
                                return;
                            }

                            if (isKeyHotkey('right', e.nativeEvent)) {
                                e.preventDefault();
                                Transforms.move(editor, { unit: 'offset' });
                                return;
                            }
                        }

                        // console.log(Range.isExpanded(editor.selection));

                        // if (Range.isExpanded(editor.selection)) {
                        //     if (isKeyHotkey('left', e.nativeEvent)) {
                        //         console.log('move left');
                        //     }
                        // }
                    }}
                    onDOMBeforeInput={(e) => {
                        console.log('inp');
                    }}
                />

                <JSONView data={editor.selection ?? []}/>

                <JSONView data={editor.children}/>
            </>
        );
    };

    return {
        Container,
        Editable,
    };
})();