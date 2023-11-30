import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { BaseEditor, BaseElement, BaseOperation, BaseSelection, BaseText, createEditor, Descendant, edges, Editor, EditorNextOptions, Element, Location, Node, NodeEntry, Path, Point, Range, Text, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { Slate, withReact, Editable as ContentEditable, ReactEditor, RenderElementProps, useSlate, RenderLeafProps } from 'slate-react';
import { isKeyHotkey } from 'is-hotkey';
import { JSONView } from '@dev';
import { getEnv, isProd, logger } from '@utils';
import { Key } from 'ts-key-enum';
import { Emoji, EmojiCode, Space, emojiRegExp } from '@components';
import { SelectionMoveOptions } from 'slate/dist/interfaces/transforms/selection';
import { StrictOmit } from 'ts-essentials';
import isUrlHtpp from 'is-url-http';



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

    export type LinkText<T extends string = string> = {
        text: T;
        link: true;
    }

    export type SlateCustomTypes = {
        Editor: RTETypes.Editor;
        Element: RTETypes.Element;
        Text: RTETypes.Text | RTETypes.LinkText;
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

            editor.onChange = (operation) => {
                const op = operation?.operation;
                console.log('change');
                if (!(
                    op?.type === 'insert_text' ||
                    op?.type === 'insert_node'
                )) return onChange(operation);

                const charsToDelete = getNumberOfCharsToDelete();
                if (charsToDelete <= 0) return onChange(operation);

                Editor.withoutNormalizing(editor, () => {
                    deleteLoop(charsToDelete);
                });

                return onChange(operation);
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
                (Element.isElement(entry[0]) && Editor.isInline(editor, entry[0])) ||
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
                if (operation.operation.type === 'set_selection') return onChange(operation);

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

    TextLink: {
        createTextLink: (url: string): RTETypes.LinkText => {
            return {
                link: true,
                text: url,
            };
        },

        isTextLink: (node: Node): node is RTETypes.LinkText => {
            return Text.isText(node) && 'link' in node;
        },

        withTextLink: ({ editor }: WithEditor) => {
            const { normalizeNode, isInline } = editor;

            editor.isInline = (element) => {
                return RTEModules.TextLink.isTextLink(element) || isInline(element);
            };

            editor.normalizeNode = (...args) => {
                const [entry] = args;

                // console.log(node);

                const isTextNode = (
                    RTEModules.Text.isSimpleText(editor, entry) &&
                    !RTEModules.Text.isEmpty(entry[0]) &&
                    !RTEModules.TextLink.isTextLink(entry[0])
                );

                if (isTextNode && RTEModules.Link.isPossibleLink(editor, entry)) {
                    const [node, path] = entry;
                    const text = node.text;

                    const url = text.split(' ').find(isUrl);
                    if (!url) return normalizeNode(...args);

                    const start = text.indexOf(url);
                    if (start === -1) return normalizeNode(...args);

                    const end = start + url.length;
                    console.log('text to link found', node, url, start, end, path);
                    // return normalizeNode(...args);
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

                    Transforms.select(editor, at);



                    // if (!Range.isCollapsed(at)) {
                    //     Transforms.delete(editor);
                    // }

                    // Transforms.setNodes(editor, { link: true }, {
                    // });

                    // Transforms.setNodes(editor, {
                    //     link: true,
                    // }, {
                    //     at,
                    //     // split: true,
                    // });

                    // Editor.withoutNormalizing(editor, () => {
                    // Transforms.insertNodes(
                    //     editor,
                    //     RTEModules.TextLink.createTextLink(url),
                    //     {
                    //         at,
                    //     },
                    // );

                    // if (selection) Transforms.setSelection(editor, selection);
                    // });


                    // Transforms.wrapNodes(
                    //     editor,
                    //     RTEModules.TextLink.createTextLink(url),
                    //     {
                    //         at,
                    //         split: true,
                    //         // match: (...matchEntry) => {
                    //         //     return RTEModules.Text.isSimpleText(editor, matchEntry);
                    //         // },
                    //     },
                    // );

                    return;
                }

                if (isTextNode) {
                    console.log('in text node start');
                    const [node, path] = entry;
                    const prevEntry = Editor.previous(editor, { at: path, voids: true });
                    const nextEntry = Editor.next(editor, { at: path, voids: true });
                    console.log('in text node', JSON.stringify([prevEntry, entry, nextEntry]));
                    if (
                        prevEntry &&
                        RTEModules.TextLink.isTextLink(prevEntry[0])
                    ) {
                        if (!node.text.startsWith(' ')) {
                            // Transforms.unwrapNodes(editor, {
                            //     at: prevEntry[1],
                            //     match: RTEModules.TextLink.isTextLink,
                            // });
                            console.log('unset text link');
                            Transforms.setNodes(editor, {
                                link: undefined,
                            }, {
                                at: prevEntry[1],
                            });

                            Transforms.mergeNodes(editor, {
                                at: path,
                            });
                        }
                    }

                    if (
                        nextEntry &&
                        RTEModules.TextLink.isTextLink(nextEntry[0])
                    ) {
                        if (!node.text.endsWith(' ')) {
                            console.log('unset text link 2');
                            // Transforms.unwrapNodes(editor, {
                            //     at: nextEntry[1],
                            //     match: RTEModules.Link.isLink,
                            // });

                            Transforms.setNodes(editor, {
                                link: undefined,
                            }, {
                                at: nextEntry[1],
                            });
                            Transforms.mergeNodes(editor, {
                                at: nextEntry[1],
                            });


                        }
                    }

                    return normalizeNode(...args);
                }

                if (RTEModules.TextLink.isTextLink(entry[0])) {
                    const [node, path] = entry;
                    console.log('in link', node);

                    const linkText = node.text;
                    // const isChanged = node.url !== linkText;
                    const isValid = isUrl(linkText);

                    // console.log(linkText, isChanged, isValid);
                    if (!isValid) {
                        console.log('not valid', linkText);
                        return Transforms.setNodes(editor, { link: undefined }, { at: path });
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

        getNextNextEntry: (editor: Editor, options?: EditorNextOptions<Descendant>) => {
            const nextEntry = Editor.next(editor, options);
            if (!nextEntry) return nextEntry;

            const nextNextEntry = Editor.next(editor, {
                ...options,
                at: nextEntry[1],
            });

            return nextNextEntry;
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
    // editor = RTEModules.TextLink.withTextLink({ editor });
    editor = RTEModules.CharacterLimit.withCharacterLimit({ editor, maxLength });
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
            maxLength: 20,
        }), []);

        const [value, setValue] = useState(() => createInitialValue());

        useEffect(() => {
            editor.normalize({ force: true });
            editor.onChange();

            Transforms.select(editor, Editor.end(editor, []));

            // if (!editor.selection) {
            //     const end = Editor.end(editor, []);

            //     editor.selection = {
            //         anchor: end,
            //         focus: end,
            //     };

            // }
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

    const InlineChromiumBugfix: FC = () => {
        return (
            <span
                contentEditable={false}
                style={{ userSelect: 'none' }}
                className={'text-[0px]'}
            >
                {String.fromCodePoint(160) /* Non-breaking space */}
            </span>
        );
    };
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
                            className='inline-block mx-0.5 message-emoji-wrapper-size'
                            data-emoji={element.code}
                            {...attributes}
                            contentEditable={false}
                        >
                            {children}

                            <span
                                className='text-[0px]'
                                contentEditable={false}
                            >
                                {/* <Space/> */}

                                {element.code}

                                {/* <Space/> */}
                            </span>

                            <Emoji
                                className='inline-block w-full h-full'
                                code={element.code}
                            />
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
                            className='text-color-link inline-block'
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

            if (RTEModules.TextLink.isTextLink(leaf)) {
                return (
                    <span
                        className='text-color-link'
                        data-url={children}
                        {...attributes}
                    >
                        {children}
                    </span>
                );
            }


            return (
                <span
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
                    suppressContentEditableWarning
                    onContextMenu={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if (!editor.selection) return;

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