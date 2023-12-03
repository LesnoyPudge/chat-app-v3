import { FC, PropsWithChildren, ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { BaseEditor, BaseElement, BaseOperation, BaseSelection, BaseText, createEditor, Descendant, Editor, EditorNextOptions, Element, Location, Node, NodeEntry, Path, Point, Range, Text, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { Slate, withReact, Editable as ContentEditable, ReactEditor, RenderElementProps, useSlate, RenderLeafProps } from 'slate-react';
import { isKeyHotkey } from 'is-hotkey';
import { JSONView } from '@dev';
import { getEnv, isProd, logger, noop, tryParseJSON } from '@utils';
import { Key } from 'ts-key-enum';
import { Emoji, EmojiCode, Link, Space, emojiRegExp } from '@components';
import { SelectionMoveOptions } from 'slate/dist/interfaces/transforms/selection';
import { StrictOmit } from 'ts-essentials';
import isUrlHtpp from 'is-url-http';
import { nanoid } from '@reduxjs/toolkit';



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

    export type Emoji<T extends EmojiCode = EmojiCode> = {
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

const isUrl = (text: string): boolean => {
    return !text.includes(' ') && isUrlHtpp(text);
};


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
    Operations: {
        INSERT_NODE: 'insert_node',
        MERGE_NODE: 'merge_node',
        MOVE_NODE: 'move_node',
        REMOVE_NODE: 'remove_node',
        SET_NODE: 'set_node',
        SPLIT_NODE: 'split_node',
        INSERT_TEXT: 'insert_text',
        REMOVE_TEXT: 'remove_text',
        SET_SELECTION: 'set_selection',
    },

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

                    if (
                        RTEModules.Text.isEmpty(lastNode) &&
                        !RTEModules.Text.isSpacerText(editor, lastEntry)
                    ) {
                        const parent = Editor.parent(editor, lastPath);

                        Transforms.removeNodes(editor, {
                            at: parent[1],
                            match: (node) => RTEModules.Utils.isBlockElement(editor, node),
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

            editor.onChange = (options) => {
                const op = options?.operation;

                const shouldContinue = (
                    !op ||
                    (
                        op &&
                        (
                            op.type === RTEModules.Operations.INSERT_TEXT ||
                            op.type === RTEModules.Operations.INSERT_NODE ||
                            op.type === RTEModules.Operations.SPLIT_NODE
                        )
                    )
                );
                if (!shouldContinue) return onChange(options);

                const charsToDelete = getNumberOfCharsToDelete();
                if (charsToDelete <= 0) return onChange(options);

                Editor.withoutNormalizing(editor, () => {
                    deleteLoop(charsToDelete);
                });

                return onChange(options);
            };

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
            // const { isSelectable } = editor;

            // editor.isSelectable = (element) => {
            //     return RTEModules.Paragraph.isParagraph(element) || isSelectable(element);
            // };

            return editor;
        },
    },

    Text: {
        createText: <T extends string>(
            text: T,
            options: Partial<StrictOmit<RTETypes.Text, 'text'>> = {},
        ): RTETypes.Text<T> => {
            return {
                text,
                ...options,
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

        isEmpty: (node: Text): node is RTETypes.Text<''> => {
            return node.text === '';
        },

        isEmptySimpleText: (
            editor: Editor,
            nodeEntry: NodeEntry,
        ): nodeEntry is NodeEntry<RTETypes.Text<''>> => {
            return (
                RTEModules.Text.isSimpleText(editor, nodeEntry) &&
                RTEModules.Text.isEmpty(nodeEntry[0])
            );
        },

        isNotEmptySimpleText: (
            editor: Editor,
            nodeEntry: NodeEntry,
        ): nodeEntry is NodeEntry<RTETypes.Text> => {
            return (
                RTEModules.Text.isSimpleText(editor, nodeEntry) &&
                !RTEModules.Text.isEmpty(nodeEntry[0])
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

        isTextOfInlineElement: (
            editor: Editor,
            nodeEntry: NodeEntry,
        ): nodeEntry is NodeEntry<Text> => {
            if (!Text.isText(nodeEntry[0])) return false;

            const [parent] = Editor.parent(editor, nodeEntry[1]);

            if (!Element.isElement(parent)) return false;

            return Editor.isInline(editor, parent);
        },

        isSpacerText: (editor: Editor, nodeEntry: NodeEntry): nodeEntry is NodeEntry<Text> => {
            const [node, path] = nodeEntry;

            if (!Text.isText(node)) return false;
            if (node.text !== '') return false;

            const prevEntry = Editor.previous(editor, { at: path, voids: true });
            const nextEntry = Editor.next(editor, { at: path, voids: true });

            if (!prevEntry && !nextEntry) return false;

            const entry = prevEntry ?? nextEntry;
            if (!entry) return false;


            const isInline = (
                RTEModules.Utils.isInlineElement(editor, entry[0]) ||
                RTEModules.Text.isTextOfInlineElement(editor, entry)
            );

            return isInline;
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

                Transforms.wrapNodes(
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
                        split: true,
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

        isLink: (node: Node): node is RTETypes.Link => {
            return Element.isElement(node) && node.type === 'link';
        },

        isPossibleLink: (editor: Editor, nodeEntry: NodeEntry): nodeEntry is NodeEntry<Text> => {
            const isText = (
                RTEModules.Text.isSimpleText(editor, nodeEntry) &&
                !RTEModules.Text.isEmpty(nodeEntry[0])
            );

            if (!isText) return false;

            return !!nodeEntry[0].text.split(' ').find(isUrl);
        },

        isTextOfLink: (
            editor: Editor,
            nodeEntry: NodeEntry,
        ): nodeEntry is NodeEntry<RTETypes.Link> => {
            if (!Text.isText(nodeEntry[0])) return false;

            const [parent] = Editor.parent(editor, nodeEntry[1]);

            return RTEModules.Link.isLink(parent);
        },

        isSimpleTextNearLink: (editor: Editor, nodeEntry: NodeEntry): boolean => {
            const [node, path] = nodeEntry;

            if (!Text.isText(node)) return false;
            if (!RTEModules.Text.isSimpleText(editor, nodeEntry)) return false;

            const prevEntry = Editor.previous(editor, { at: path, voids: true });
            const nextEntry = Editor.next(editor, { at: path, voids: true });

            return (
                (!!prevEntry && RTEModules.Link.isLink(prevEntry[0])) ||
                (!!nextEntry && RTEModules.Link.isLink(nextEntry[0]))
            );
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
            const { normalizeNode, isInline, onChange } = editor;

            editor.isInline = (element) => {
                return RTEModules.Link.isLink(element) || isInline(element);
            };

            editor.onChange = (operation) => {
                if (!operation) return onChange(operation);
                if (!operation.operation) return onChange(operation);
                if (operation.operation.type === RTEModules.Operations.SET_SELECTION) {
                    return onChange(operation);
                }

                const entries = Array.from(Editor.nodes(editor, {
                    at: [],
                    match: (...entry) => {
                        return (
                            RTEModules.Link.isSimpleTextNearLink(editor, entry)
                        );
                    },
                }));

                entries.forEach((entry) => {
                    editor.normalizeNode(entry);
                });

                return onChange(operation);
            };

            editor.normalizeNode = (...args) => {
                const [entry] = args;

                const isTextNode = (
                    RTEModules.Text.isSimpleText(editor, entry) &&
                    !RTEModules.Text.isEmpty(entry[0])
                );

                if (isTextNode && RTEModules.Link.isPossibleLink(editor, entry)) {
                    const [node, path] = entry;
                    const text = node.text;

                    const url = text.split(' ').find(isUrl);
                    if (!url) return normalizeNode(...args);

                    const start = text.indexOf(url);
                    if (start === -1) return normalizeNode(...args);

                    const end = start + url.length;

                    const at: Location = {
                        anchor: {
                            path,
                            offset: start,
                        },
                        focus: {
                            path,
                            offset: end,
                        },
                    };

                    Transforms.wrapNodes(
                        editor,
                        RTEModules.Link.createLink(url),
                        {
                            at,
                            split: true,
                        },
                    );

                    return;
                }

                if (isTextNode) {
                    const [node, path] = entry;
                    const prevEntry = Editor.previous(editor, { at: path, voids: true });
                    const nextEntry = Editor.next(editor, { at: path, voids: true });

                    if (
                        prevEntry &&
                        RTEModules.Link.isLink(prevEntry[0])
                    ) {
                        if (!node.text.startsWith(' ')) {
                            Editor.withoutNormalizing(editor, () => {
                                Transforms.unwrapNodes(editor, {
                                    at: prevEntry[1],
                                    match: RTEModules.Link.isLink,
                                });

                                Transforms.mergeNodes(editor, {
                                    at: path,
                                });
                            });
                        }
                    }

                    if (
                        nextEntry &&
                        RTEModules.Link.isLink(nextEntry[0])
                    ) {
                        if (!node.text.endsWith(' ')) {
                            Editor.withoutNormalizing(editor, () => {
                                Transforms.unwrapNodes(editor, {
                                    at: nextEntry[1],
                                    match: RTEModules.Link.isLink,
                                });

                                Transforms.mergeNodes(editor, {
                                    at: nextEntry[1],
                                });
                            });
                        }
                    }

                    return normalizeNode(...args);
                }

                if (RTEModules.Link.isLink(entry[0])) {
                    const [node, path] = entry;

                    const linkText = node.children[0].text;
                    const isChanged = node.url !== linkText;
                    const isValid = isUrl(linkText);

                    if (isChanged && isValid) {
                        Transforms.setNodes(editor, { url: linkText }, { at: path });
                    }

                    if (!isValid) {
                        return Transforms.unwrapNodes(editor, { at: path });
                    }

                    return;
                }

                return normalizeNode(...args);
            };

            return editor;
        },
    },

    SelectableTuning: {
        withSelectableTuning: ({ editor }: WithEditor) => {
            const { move, setSelection } = editor;

            editor.move = (options = {}) => {
                if (options.unit) return move(options);
                console.log('move');
                const selection = editor.selection;
                if (!selection) return move(options);

                const { reverse } = options;

                const currentNodeEntry = Editor.node(editor, selection.focus);

                const isInsideInlineElement = RTEModules.Text.isTextOfInlineElement(
                    editor,
                    currentNodeEntry,
                );

                if (isInsideInlineElement) {
                    const [currentNode] = currentNodeEntry;

                    const isAtStart = selection.focus.offset === 0;
                    const isAtEnd = selection.focus.offset === currentNode.text.length;

                    if (isAtStart || isAtEnd) {
                        options.distance = 2;
                    }
                }

                if (!isInsideInlineElement) {
                    const nodeEntryToLookAt = (
                        reverse
                            ? Editor.previous
                            : Editor.next
                    )(editor, { at: selection.focus, voids: true });

                    if (nodeEntryToLookAt) {
                        const isSelectableInline = (
                            RTEModules.Text.isTextOfInlineElement(editor, nodeEntryToLookAt) &&
                            RTEModules.Text.isTextOfSelectableElement(editor, nodeEntryToLookAt)
                        );

                        if (isSelectableInline) {
                            options.distance = 2;
                        }
                    }
                }

                options.unit = 'offset';

                return move(options);
            };

            editor.setSelection = (selection) => {
                if (!Range.isRange(selection)) return setSelection(selection);

                const nodeEntry = Editor.node(editor, selection);
                const [node, path] = nodeEntry;

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
                }

                logger.error('no selection handler match', node);

                return setSelection(selection);
            };

            return editor;
        },
    },

    Dev: {
        withDevWindow: ({ editor }: WithEditor) => {
            if (isProd()) return editor;

            // @ts-ignore
            if (!window.slate) {
                // @ts-ignore
                window.slate = {
                    editor,
                    Editor,
                    RTEModules,
                    Node,
                    Text,
                    Range,
                    Element,
                    Transforms,
                };
            }

            return editor;
        },
    },

    Utils: {
        isSelectableElement: (editor: Editor, node: Node): node is Element => {
            return Element.isElement(node) && Editor.isSelectable(editor, node);
        },

        isInlineElement: (editor: Editor, node: Node): node is Element => {
            return Element.isElement(node) && Editor.isInline(editor, node);
        },

        isBlockElement: (editor: Editor, node: Node): node is Element => {
            return Element.isElement(node) && Editor.isBlock(editor, node);
        },
    },

    Render: {
        renderElement: (() => {
            const InlineChromiumBugfix: FC = () => {
                return (
                    <span
                        contentEditable={false}
                        className={'text-[0px]'}
                    >
                        {String.fromCodePoint(160) /* Non-breaking space */}
                    </span>
                );
            };

            // eslint-disable-next-line react/display-name
            return ({
                attributes,
                children,
                element,
            }: RenderElementProps) => {
                switch (true) {
                    case RTEModules.Emoji.isEmoji(element): {
                        return (
                            <span
                                className='inline-block mx-0.5 message-emoji-wrapper-size'
                                data-emoji={element.code}
                                {...attributes}
                                contentEditable={false}
                            >
                                <InlineChromiumBugfix/>
                                {children}

                                <span
                                    className='text-[0px]'
                                    contentEditable={false}
                                >
                                    {element.code}
                                </span>

                                <Emoji
                                    className='inline-block w-full h-full'
                                    code={element.code}
                                />
                                <InlineChromiumBugfix/>
                            </span>
                        );
                    }

                    case RTEModules.Link.isLink(element): {
                        return (
                            <span
                                className='text-color-link'
                                data-url={element.url}
                                {...attributes}
                            >
                                <InlineChromiumBugfix/>
                                {children}
                                <InlineChromiumBugfix/>
                            </span>
                        );
                    }

                    case RTEModules.Paragraph.isParagraph(element): {
                        return (
                            <p {...attributes}>
                                {children}
                            </p>
                        );
                    }

                    default: {
                        logger.error('unhandled rendering element type');
                        break;
                    }
                }
            };
        })(),

        renderLeaf: (props: RenderLeafProps) => {
            const { attributes, children, leaf } = props;

            return (
                <span
                    {...attributes}
                >
                    {children}
                </span>
            );
        },

        serialize: (() => {
            const loop = (node: Descendant): ReactNode => {
                const key = String(Math.random());

                if (Text.isText(node)) return (
                    <span key={key}>{node.text}</span>
                );

                const value = node.children.map(loop);

                switch (true) {
                    case RTEModules.Paragraph.isParagraph(node): {
                        return (
                            <p key={key}>
                                {value}
                            </p>
                        );
                    }

                    case RTEModules.Emoji.isEmoji(node): {
                        return (
                            <Emoji
                                className='mx-0.5 message-emoji-wrapper-size'
                                code={node.code}
                                key={key}
                            />
                        );
                    }

                    case RTEModules.Link.isLink(node): {
                        return (
                            <Link
                                className='text-color-link'
                                href={node.url}
                                label='Ссылка на внешний ресурс'
                                key={key}
                            >
                                {value}
                            </Link>
                        );
                    }

                    default: {
                        logger.error('unhandled element serialization');
                        return value;
                    }
                }
            };

            return (nodes: Descendant[]) => {
                return nodes.map(loop);
            };
        })(),
    },

    Events: {
        KeyDown: (editor: Editor) => {
            return (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (!editor.selection) return;

                if (isKeyHotkey('shift+left', e.nativeEvent)) {
                    e.preventDefault();

                    Transforms.move(editor, {
                        reverse: true,
                        edge: 'focus',
                    });
                }

                if (isKeyHotkey('shift+right', e.nativeEvent)) {
                    e.preventDefault();

                    Transforms.move(editor, {
                        reverse: false,
                        edge: 'focus',
                    });
                }
            };
        },
    },
};

type EditorCreatorOptions = {
    characterLimit: WithCharacterLimit;
};

const createEditorWithPlugins = ({
    characterLimit,
}: EditorCreatorOptions) => {
    let editor = createEditor();

    editor = withHistory(editor);
    editor = withReact(editor);
    editor = RTEModules.Paragraph.withParagraph({ editor });
    editor = RTEModules.Emoji.withEmoji({ editor });
    editor = RTEModules.Link.withLink({ editor });
    editor = RTEModules.CharacterLimit.withCharacterLimit({ editor, ...characterLimit });
    editor = RTEModules.SelectableTuning.withSelectableTuning({ editor });
    editor = RTEModules.Dev.withDevWindow({ editor });

    return editor;
};

const createInitialValue = (): Descendant[] => {
    return [
        RTEModules.Paragraph.createParagraph([
            RTEModules.Text.createText('so'),
            RTEModules.Emoji.createEmoji(':ok:'),
            RTEModules.Text.createText('me te'),
            RTEModules.Link.createLink('https://www.youtube.com/watch?v=DxdCDviaU6U'),
            // RTEModules.TextLink.createTextLink('https://www.youtube.com/watch?v=DxdCDviaU6U'),
            RTEModules.Text.createText('xt '),
            RTEModules.Emoji.createEmoji(':poop:'),
            RTEModules.Text.createText(''),
            RTEModules.Link.createLink('https://ww'),
            // RTEModules.TextLink.createTextLink('https://ww'),
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
            characterLimit: {
                maxLength: 2000,
            },
        }), []);

        const [value, setValue] = useState(() => createInitialValue());

        useEffect(() => {
            editor.normalize({ force: true });
            editor.onChange();
        }, [editor]);

        return (
            <Slate
                editor={editor}
                initialValue={value}
                onValueChange={setValue}
                key={''}
            >
                {children}
            </Slate>
        );
    };

    const Editable: FC = () => {
        const editor = useSlate();

        return (
            <>
                <ContentEditable
                    className='rich-text-editor'
                    renderElement={RTEModules.Render.renderElement}
                    // renderPlaceholder={}
                    renderLeaf={RTEModules.Render.renderLeaf}
                    suppressContentEditableWarning
                    onContextMenu={(e) => e.stopPropagation()}
                    onKeyDown={RTEModules.Events.KeyDown(editor)}
                />

                {/* <JSONView data={editor.selection ?? []}/>

                <JSONView data={editor.children}/> */}

                <Serialized value={editor.children}/>
            </>
        );
    };

    const Serialized: FC<{value: string | Descendant[]}> = ({ value }) => {
        const result = useMemo(() => {
            const parsed = (
                typeof value === 'string'
                    ? tryParseJSON<Descendant[]>(value)
                    : value
            );
            if (!parsed) return null;

            try {
                return RTEModules.Render.serialize(parsed);
            } catch (error) {
                return null;
            }
        }, [value]);

        return (
            <>
                {result}
            </>
        );
    };

    return {
        Container,
        Editable,
        Serialized,
    };
})();