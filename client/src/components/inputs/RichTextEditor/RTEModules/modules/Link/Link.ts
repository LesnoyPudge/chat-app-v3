import { RTEModules, RTETypes } from '@components';
import { isUrlHttp } from '@utils';
import { Editor, Element, Location, Node, NodeEntry, Text, Transforms } from 'slate';



export const Link = {
    createLink: <T extends string>(url: T): RTETypes.Elements.Link<T> => {
        return {
            type: 'link',
            url,
            children: [
                RTEModules.Text.createText(url),
            ],
        };
    },

    isLink: (node: unknown): node is RTETypes.Elements.Link => {
        return Element.isElement(node) && node.type === 'link';
    },

    isPossibleLink: (editor: Editor, nodeEntry: NodeEntry): nodeEntry is NodeEntry<Text> => {
        const isText = (
            RTEModules.Text.isSimpleText(editor, nodeEntry) &&
            !RTEModules.Text.isEmpty(nodeEntry[0])
        );

        if (!isText) return false;

        return !!nodeEntry[0].text.split(' ').find(isUrlHttp);
    },

    isTextOfLink: (
        editor: Editor,
        nodeEntry: NodeEntry,
    ): nodeEntry is NodeEntry<RTETypes.Elements.Link> => {
        if (!Text.isText(nodeEntry[0])) return false;

        const [parent] = Editor.parent(editor, nodeEntry[1]);

        return Link.isLink(parent);
    },

    isSimpleTextNearLink: (editor: Editor, nodeEntry: NodeEntry): boolean => {
        const [node, path] = nodeEntry;

        if (!Text.isText(node)) return false;
        if (!RTEModules.Text.isSimpleText(editor, nodeEntry)) return false;

        const prevEntry = Editor.previous(editor, { at: path, voids: true });
        const nextEntry = Editor.next(editor, { at: path, voids: true });

        return (
            (!!prevEntry && Link.isLink(prevEntry[0])) ||
            (!!nextEntry && Link.isLink(nextEntry[0]))
        );
    },

    withLink: ({ editor }: RTETypes.Helpers.WithEditor) => {
        const { normalizeNode, isInline, onChange } = editor;

        editor.isInline = (element) => {
            return Link.isLink(element) || isInline(element);
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
                        Link.isSimpleTextNearLink(editor, entry)
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

            if (isTextNode && Link.isPossibleLink(editor, entry)) {
                const [node, path] = entry;
                const text = node.text;

                const url = text.split(' ').find(isUrlHttp);
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
                    Link.createLink(url),
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
                    Link.isLink(prevEntry[0])
                ) {
                    if (!node.text.startsWith(' ')) {
                        Editor.withoutNormalizing(editor, () => {
                            Transforms.unwrapNodes(editor, {
                                at: prevEntry[1],
                                match: Link.isLink,
                            });

                            Transforms.mergeNodes(editor, {
                                at: path,
                            });
                        });
                    }
                }

                if (
                    nextEntry &&
                    Link.isLink(nextEntry[0])
                ) {
                    if (!node.text.endsWith(' ')) {
                        Editor.withoutNormalizing(editor, () => {
                            Transforms.unwrapNodes(editor, {
                                at: nextEntry[1],
                                match: Link.isLink,
                            });

                            Transforms.mergeNodes(editor, {
                                at: nextEntry[1],
                            });
                        });
                    }
                }

                return normalizeNode(...args);
            }

            if (Link.isLink(entry[0])) {
                const [node, path] = entry;

                const linkText = node.children[0].text;
                const isChanged = node.url !== linkText;
                const isValid = isUrlHttp(linkText);

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
};