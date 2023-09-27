import { Editor, Element, Path, Text, Transforms } from 'slate';
import { CustomEditor, CustomText, LinkElement } from '../../types';



type WrapLinkType = (args: {
    node: CustomText,
    url: string,
    path: Path,
    editor: CustomEditor
}) => void;

const wrapLink: WrapLinkType = ({ editor, node, path, url }) => {
    const startOfUrl = node.text.indexOf(url);
    const endOfUrl = startOfUrl + url.length;
    const link: LinkElement = {
        type: 'link',
        url: url,
        children: [{ text: url }],
    };
    const options = {
        split: true,
        at: {
            anchor: {
                path,
                offset: startOfUrl,
            },
            focus: {
                path,
                offset: endOfUrl,
            },
        },
    };

    Transforms.wrapNodes(editor, link, options);
};

export const withLink = (editor: CustomEditor) => {
    const { isInline, normalizeNode } = editor;

    editor.isInline = (element) => {
        return element.type === 'link' ? true : isInline(element);
    };

    editor.normalizeNode = (entry) => {
        try {
            const [node, path] = entry;
            const urlRegex = /(https?:\/\/[^\s]+)/gm;

            const match = Text.isText(node) && node.text.match(urlRegex);
            const parent = Text.isText(node) && Editor.parent(editor, path);
            const linkElement = parent && Element.isElement(parent[0]) && parent[0].type === 'link' && parent[0];
            const pathToLinkElement = linkElement && parent[1];
            const isInLink = linkElement && pathToLinkElement;
            const url = !!match && match[0];
            const isValidText = linkElement && node.text === url;

            if (isInLink && url) {
                Transforms.setNodes(editor, { url }, { at: pathToLinkElement });
            }

            if (isInLink && !url) {
                Transforms.unwrapNodes(editor, { at: pathToLinkElement });
            }

            if (isInLink && url && !isValidText) {
                wrapLink({ editor, node, path, url });
            }

            if (!isInLink && url) {
                wrapLink({ editor, node, path, url });
            }

            normalizeNode(entry);
        } catch (error) {
            console.log('error link normalize');
            normalizeNode(entry);
        }
    };

    return editor;
};