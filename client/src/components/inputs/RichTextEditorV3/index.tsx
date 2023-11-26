import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { BaseEditor, BaseElement, BaseOperation, BaseSelection, BaseText, createEditor, Descendant, Editor, Element, Node, NodeEntry, Path, Point, Range, Text, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { Slate, withReact, Editable as ContentEditable, ReactEditor, RenderElementProps, useSlate, RenderLeafProps } from 'slate-react';
import { isKeyHotkey } from 'is-hotkey';
import { JSONView } from '@dev';
import { logger } from '@utils';
import { Key } from 'ts-key-enum';
import { EmojiCode, emojiRegExp } from '@components';
import { SelectionMoveOptions } from 'slate/dist/interfaces/transforms/selection';



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
        some?: boolean;
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

        withParagraph: ({ editor }: WithEditor) => {
            const { isSelectable } = editor;

            editor.isSelectable = (element) => {
                return RTEModules.Paragraph.isParagraph(element) || isSelectable(element);
            };

            return editor;
        },
    },

    Text: {
        createText: <T extends string>(text: T): RTETypes.Text<T> => {
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

        isEmptySimpleText: (
            editor: Editor,
            nodeEntry: NodeEntry,
        ): nodeEntry is NodeEntry<Text> => {
            return RTEModules.Text.isSimpleText(editor, nodeEntry) && nodeEntry[0].text === '';
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

        isTextOfSelectableElement: (
            editor: Editor,
            nodeEntry: NodeEntry,
        ): nodeEntry is NodeEntry<Text> => {
            if (!Text.isText(nodeEntry[0])) return false;

            const [parent] = Editor.parent(editor, nodeEntry[1]);

            if (!Element.isElement(parent)) return false;

            return Editor.isSelectable(editor, parent);
        },

        isTextOfUnselectableElement: (
            editor: Editor,
            nodeEntry: NodeEntry,
        ): nodeEntry is NodeEntry<Text> => {
            if (!Text.isText(nodeEntry[0])) return false;

            const [parent] = Editor.parent(editor, nodeEntry[1]);

            if (!Element.isElement(parent)) return false;

            return !Editor.isSelectable(editor, parent);
        },
    },

    Emoji: {
        createEmoji: <T extends EmojiCode>(code: T): RTETypes.Emoji<T> => {
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

        getEmojiMatch: (text: string) => {
            text = text.toLowerCase();

            const match = text.match(emojiRegExp);
            const noMatch = !match || !match.length;
            if (noMatch) return null;

            const emojiCode = match[0] as EmojiCode;

            const matchStart = text.indexOf(emojiCode);
            const matchEnd = matchStart + emojiCode.length;

            return {
                emojiCode,
                matchStart,
                matchEnd,
            };
        },

        withEmoji: ({ editor }: WithEditor) => {
            const {
                isInline, isElementReadOnly, isSelectable,
                isVoid, normalizeNode,
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

            editor.normalizeNode = (...args) => {
                const [entry] = args;

                if (!RTEModules.Text.isSimpleText(editor, entry)) return normalizeNode(...args);

                const [node, path] = entry;

                const match = RTEModules.Emoji.getEmojiMatch(node.text);
                if (!match) return normalizeNode(...args);

                Transforms.insertNodes(
                    editor,
                    RTEModules.Emoji.createEmoji(match.emojiCode),
                    {
                        at: {
                            anchor: {
                                path,
                                offset: match.matchStart,
                            },
                            focus: {
                                path,
                                offset: match.matchEnd,
                            },
                        },
                    },
                );

                return normalizeNode(...args);
            };

            return editor;
        },
    },

    Link: {
        createLink: <T extends string>(url: T): RTETypes.Link<T> => {
            return {
                type: 'link',
                url,
                children: [
                    RTEModules.Text.createText(url),
                ],
            };
        },

        isLink: (node: Node) => {
            return Element.isElement(node) && node.type === 'link';
        },

        getLinkMatch: (() => {
            // eslint-disable-next-line no-useless-escape
            const urlRegExp = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;

            return (text: string) => {
                const match = text.match(urlRegExp);
                if (!match || !match.length) return null;

                const url = match[0];

                const matchStart = text.indexOf(url);
                const matchEnd = matchStart + url.length;

                return {
                    url,
                    matchStart,
                    matchEnd,
                };
            };
        })(),

        withLink: ({ editor }: WithEditor) => {
            const { normalizeNode, isInline } = editor;

            editor.isInline = (element) => {
                return RTEModules.Link.isLink(element) || isInline(element);
            };

            editor.normalizeNode = (...args) => {
                const [entry] = args;

                if (!RTEModules.Text.isSimpleText(editor, entry)) return normalizeNode(...args);

                const [node, path] = entry;

                const match = RTEModules.Link.getLinkMatch(node.text);
                if (!match) return normalizeNode(...args);

                Transforms.insertNodes(
                    editor,
                    RTEModules.Link.createLink(match.url),
                    {
                        at: {
                            anchor: {
                                path,
                                offset: match.matchStart,
                            },
                            focus: {
                                path,
                                offset: match.matchEnd,
                            },
                        },
                    },
                );

                return normalizeNode(...args);
            };

            return editor;
        },
    },

    SelectableTuning: {
        withSelectableTuning: ({ editor }: WithEditor) => {
            const { move, setSelection } = editor;

            const bail = (
                nodeEntryToLookAt: NodeEntry | undefined,
                options: SelectionMoveOptions = {},
            ) => {
                if (!nodeEntryToLookAt) return move(options);

                const isSelectable = (
                    RTEModules.Text.isSimpleText(editor, nodeEntryToLookAt) ||
                    RTEModules.Text.isTextOfSelectableElement(editor, nodeEntryToLookAt) ||
                    RTEModules.Utils.isSelectableElement(editor, nodeEntryToLookAt[0])
                );

                options.unit = isSelectable ? 'character' : 'offset';

                return move(options);
            };

            editor.move = (options = {}) => {
                if (options.unit) return move(options);

                const selection = editor.selection;
                if (!selection) return move(options);

                const { reverse } = options;

                const nodeEntryToLookAt = (
                    reverse
                        ? Editor.previous
                        : Editor.next
                )(editor, {
                    at: selection.focus,
                    voids: true,
                    // match: (...entry) => !RTEModules.Text.isEmptySimpleText(editor, entry),
                });

                if (!nodeEntryToLookAt) return move(options);
                console.log(JSON.stringify(nodeEntryToLookAt));

                const isSelectable = (
                    RTEModules.Text.isTextOfSelectableElement(editor, nodeEntryToLookAt) ||
                    RTEModules.Utils.isSelectableElement(editor, nodeEntryToLookAt[0])
                );
                console.log(isSelectable);
                options.unit = isSelectable ? 'character' : 'offset';

                return move(options);






                const selectionForward = Range.isForward(selection);

                const selectionForwardMoveForward = selectionForward && !reverse;
                const selectionBackwardMoveBackward = !selectionForward && reverse;

                const handleAsCollapsedCaret = (
                    Range.isCollapsed(selection) ||
                    selectionForwardMoveForward ||
                    selectionBackwardMoveBackward
                );

                if (handleAsCollapsedCaret) {
                    const entry = (
                        reverse
                            ? Editor.previous
                            : Editor.next
                    )(editor, {
                        at: selection,
                        voids: true,
                    });

                    return bail(entry, options);
                }

                // const latestSelectedNodeEntry = Editor.node(editor, selection.focus);

                // const toLook = (
                //     reverse
                //         ? Editor.previous
                //         : Editor.next
                // )(editor, { at: selection.focus, voids: true });

                // return bail(toLook, options);

                const selectionForwardMoveBackward = selectionForward && reverse;
                const lastSelectedNodeEntry = Editor.last(editor, selection);

                if (selectionForwardMoveBackward) {
                    const [lastNode, lastPath] = lastSelectedNodeEntry;

                    if (!Text.isText(lastNode)) return move(options);

                    const isAtStartOfNode = selection.focus.offset === 0;
                    if (isAtStartOfNode) {
                        const prev = Editor.previous(editor, { at: lastPath, voids: true });
                        return bail(prev, options);
                    }

                    return bail(lastSelectedNodeEntry, options);
                }

                const firstSelectedNodeEntry = Editor.first(editor, selection);
                const selectionBackwardMoveForward = !selectionForward && !reverse;

                if (selectionBackwardMoveForward) {
                    const [firstNode] = firstSelectedNodeEntry;
                    if (!Text.isText(firstNode)) return move(options);

                    const isAtEndOfNode = selection.focus.offset === firstNode.text.length;
                    if (isAtEndOfNode) {
                        const next = Editor.next(editor, { at: selection.focus, voids: true });
                        return bail(next, options);
                    }

                    if (!isAtEndOfNode) return bail(firstSelectedNodeEntry, options);
                }

                logger.error('unhandled selectable tuning');

                return move(options);
            };

            editor.setSelection = (selection) => {
                if (!Range.isRange(selection)) return setSelection(selection);

                const nodeEntry = Editor.node(editor, selection);
                const [node, path] = nodeEntry;
                // console.log(JSON.stringify([nodeEntry, selection]));
                if (
                    RTEModules.Text.isTextOfSelectableElement(editor, nodeEntry) ||
                    RTEModules.Utils.isSelectableElement(editor, node)
                ) return setSelection(selection);

                if (RTEModules.Text.isTextOfUnselectableElement(editor, nodeEntry)) {
                    const [_, parentPath] = Editor.parent(editor, path);

                    const nextEntry = Editor.next(editor, {
                        at: parentPath,
                        match: (mn, mp) => RTEModules.Text.isSimpleText(editor, [mn, mp]),
                    }) ?? Editor.last(editor, []);


                    Transforms.select(editor, nextEntry[1]);
                    Transforms.collapse(editor);

                    return;

                    // selection.anchor = {
                    //     path: nextEntry[1],
                    //     offset: 0,
                    // };

                    // selection.focus = {
                    //     path: nextEntry[1],
                    //     offset: 0,
                    // };

                    // return setSelection(selection);
                }

                logger.error('no selection handler match', node);

                return setSelection(selection);
            };

            return editor;
        },
    },

    Utils: {
        isSelectableElement: (editor: Editor, node: Node): node is Element => {
            return Element.isElement(node) && Editor.isSelectable(editor, node);
        },

        isB: () => {
            // Path.
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
    editor = RTEModules.Paragraph.withParagraph({ editor });
    editor = RTEModules.Emoji.withEmoji({ editor });
    editor = RTEModules.Link.withLink({ editor });
    editor = RTEModules.CharacterLimit.withCharacterLimit({ editor, maxLength });
    editor = RTEModules.SelectableTuning.withSelectableTuning({ editor });

    return editor;
};

const createInitialValue = (): Descendant[] => {
    return [
        RTEModules.Paragraph.createParagraph([
            RTEModules.Text.createText('so'),
            RTEModules.Emoji.createEmoji(':ok:'),
            RTEModules.Text.createText('me te'),
            RTEModules.Link.createLink('https://www.youtube.com/watch?v=DxdCDviaU6U'),
            RTEModules.Text.createText('xt '),
            RTEModules.Emoji.createEmoji(':poop:'),
            RTEModules.Text.createText(''),
            RTEModules.Link.createLink('https://ww'),
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
                        // return;
                        // if (!(
                        //     e.key === Key.ArrowLeft ||
                        //     e.key === Key.ArrowRight
                        // )) return;

                        if (isKeyHotkey('shift+left', e.nativeEvent)) {
                            e.preventDefault();
                            console.log('handle shift left');

                            Transforms.move(editor, {
                                // unit: 'offset',
                                reverse: true,
                                edge: 'focus',
                            });
                        }


                        if (isKeyHotkey('shift+right', e.nativeEvent)) {
                            e.preventDefault();
                            console.log('handle shift right');

                            Transforms.move(editor, {
                                // unit: 'offset',
                                reverse: false,
                                edge: 'focus',
                            });
                        }
                        return;
                        // if (e.key === 'ArrowRight') {
                        //     e.preventDefault();
                        // Transforms.move(editor, {
                        //     unit: 'line',
                        //     edge: 'focus',
                        // });
                        // }

                        if (Range.isCollapsed(editor.selection)) {
                            if (isKeyHotkey('left', e.nativeEvent)) {

                                const prev = Editor.previous(editor, { at: editor.selection, voids: true });
                                if (!prev) return;

                                e.preventDefault();
                                Transforms.move(editor, {
                                    unit: Element.isElement(prev[0]) && Editor.isSelectable(editor, prev[0]) ? 'character' : 'offset',
                                    reverse: true,
                                });
                                return;
                            }

                            if (isKeyHotkey('right', e.nativeEvent)) {

                                const next = Editor.next(editor, {
                                    at: editor.selection,
                                    voids: true,
                                });
                                if (!next) return;
                                const isSelectable = RTEModules.Text.isEditableElementText(editor, next);
                                console.log(JSON.stringify(next), isSelectable);
                                e.preventDefault();
                                Transforms.move(editor, {
                                    unit: isSelectable ? 'character' : 'offset',
                                });
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