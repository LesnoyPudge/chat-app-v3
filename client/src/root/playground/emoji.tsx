import { EmojiCode, Emoji, emojiList } from '@components';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { SerializedTextNode, TextNode, NodeKey, ElementNode, SerializedElementNode, SerializedLexicalNode, DecoratorNode, LexicalEditor, DOMExportOutput, LexicalNode, EditorConfig } from 'lexical';
import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';



type EmojiComponent = PropsWithClassName & {
    code: EmojiCode;
}

export const EmojiComponent: FC<EmojiComponent> = ({
    className = '',
    code,
}) => {
    const styles = {
        wrapper: 'inline-block mx-0.5 message-emoji-size',
        emoji: 'inline-block w-full h-full',
    };

    return (
        <span
            className={twClassNames(styles.wrapper, className)}
            contentEditable={false}
            draggable={false}
        >
            <Emoji
                className={styles.emoji}
                code={code}
            />
        </span>
    );
};

// type SerializedEmojiNode = SerializedLexicalNode & {
//     code: EmojiCode,
// }

type SerializedEmojiNode = SerializedTextNode & {
    code: EmojiCode,
}

// class EmojiNode extends DecoratorNode<ReactNode> {
//     __code: EmojiCode;

//     constructor(code: EmojiCode, key?: NodeKey) {
//         super(key);
//         this.__code = code;
//     }

//     static getType(): string {
//         return 'emoji';
//     }

//     static clone(node: EmojiNode): EmojiNode {
//         return new EmojiNode(node.__code, node.__key);
//     }

//     static importJSON(serializedNode: SerializedEmojiNode): EmojiNode {
//         console.log('import json', serializedNode);
//         return $createEmojiNode(serializedNode.code);
//     }

//     // static importDOM(): DOMConversionMap {
//     //     return {
//     //         span: (_) => ({
//     //             priority: 0,
//     //             conversion: (domNode) => {
//     //                 console.log('import dom', domNode);
//     //                 if (!(domNode instanceof HTMLSpanElement)) return null;

//     //                 const code = domNode.dataset.code;
//     //                 if (!code) return null;

//     //                 const isMatch = emojiCodeRegExp.test(code);
//     //                 if (!isMatch) return null;

//     //                 const node = $createEmojiNode(code as EmojiCode);

//     //                 return {
//     //                     node,
//     //                 };
//     //             },
//     //         }),
//     //     };
//     // }

//     createDOM(): HTMLElement {
//         return document.createElement('span');
//     }

//     updateDOM(): boolean {
//         return false;
//     }

//     decorate(): ReactNode {
//         return (
//             <EmojiComponent code={this.__code}/>
//         );
//     }

//     exportJSON(): SerializedEmojiNode {
//         // const json = new TextNode(this.__code).exportJSON();
//         console.log('export json');
//         return {
//             code: this.__code,
//             type: this.getType(),
//             version: 1,
//         };
//     }

//     exportDOM(editor: LexicalEditor): DOMExportOutput {
//         const element = document.createElement('span');
//         element.dataset.code = this.__code;

//         const emoji = emojiList.find(item => item.code.includes(this.__code));
//         if (!emoji) return { element: null };

//         element.innerHTML = emoji.label;
//         console.log('export dom');
//         return { element };
//     }

//     // isParentRequired(): boolean {
//     //     return true;
//     // }

//     isInline(): boolean {
//         return true;
//     }

//     isIsolated(): boolean {
//         return true;
//     }
// }

const pl = () => {};

export class EmojiNode extends TextNode {
    __code: EmojiCode;

    constructor(code: EmojiCode, key?: NodeKey) {
        const emoji = emojiList.find((item) => item.code.includes(code)) || emojiList[0];
        super(emoji.label, key);
        this.__code = code;
    }

    static getType(): string {
        return 'emoji';
    }

    static clone(node: EmojiNode): EmojiNode {
        return new EmojiNode(node.__code, node.__key);
    }

    // static importJSON(serializedNode: SerializedEmojiNode): EmojiNode {
    //     return $createEmojiNode(serializedNode.code);
    // }

    getCode(): string {
        return this.getLatest().__code;
    }

    exportJSON(): SerializedEmojiNode {
        return {
            code: this.__code,
            detail: this.__detail,
            format: this.__format,
            mode: 'token',
            style: this.__style,
            text: this.__text,
            type: this.getType(),
            version: 1,
        };
    }

    updateDOM() {
        return false;
    }

    createDOM(config: EditorConfig) {
        const element = super.createDOM(config);
        element.dataset.code = this.__code;

        // const root = document.createElement('span');
        // element.appendChild(root);
        // console.log('create dom');
        // // <EmojiComponent code={this.__code}/>
        // setTimeout(() => {
        //     createRoot(root).render(<>wow</>);
        // });
        // return <EmojiComponent code={this.__code}/>
        return element;
    }
}

export class EmojiWrapper extends ElementNode {
    constructor(key?: NodeKey) {
        super(key);
    }

    static clone(node: EmojiWrapper): EmojiWrapper {
        return new EmojiWrapper(node.__key);
    }

    static getType(): string {
        return 'emoji-wrapper';
    }

    exportJSON(): SerializedElementNode<SerializedLexicalNode> {
        return {
            ...super.exportJSON(),
            type: this.getType(),
            version: 1,
            // children: $createEmojiNode(':poop:').getChildren().map((node) => node.exportJSON()),
        };
    }

    createDOM(): HTMLElement {
        const dom = document.createElement('div');
        return dom;
    }

    updateDOM(): boolean {
        return false;
    }

    isInline(): boolean {
        return true;
    }

    canBeEmpty(): boolean {
        return false;
    }
}

type SerializedEmojiDecoratorNode = SerializedLexicalNode & {
    code: EmojiCode,
}

export class EmojiDecoratorNode extends DecoratorNode<ReactNode> {
    __code: EmojiCode;

    constructor(code: EmojiCode, key?: NodeKey) {
        super(key);
        this.__code = code;
    }

    static getType(): string {
        return 'emoji-decorator';
    }

    static clone(node: EmojiDecoratorNode) {
        return new EmojiDecoratorNode(node.__code, node.__key);
        // return new TextNode(node.__code, node.__key);
    }

    static importJSON(_serializedNode: SerializedEmojiDecoratorNode) {
        return $createEmojiNode(_serializedNode.code);
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const element = document.createElement('span');
        element.dataset.code = this.__code;
        element.innerHTML = this.__code;

        return {
            element: element,
        };
    }

    exportJSON() {
        return {
            code: this.__code,
            type: this.getType(),
            version: 1,
        };
    }

    createDOM(): HTMLElement {
        return document.createElement('span');
    }

    updateDOM(): boolean {
        return false;
    }

    decorate(): ReactNode {
        return (
            <span>
                <>{this.__code}</>
            </span>
        );
        return (
            <EmojiComponent code={this.__code}/>
        );
    }

    isParentRequired(): boolean {
        return true;
    }

    isInline(): boolean {
        return true;
    }

    isIsolated(): boolean {
        return true;
    }

    isKeyboardSelectable(): boolean {
        return true;
    }

}

export const $createEmojiNode = (code: EmojiCode) => {
    // return new EmojiNode(code);
    // return new EmojiNode(code).setMode('token');

    // const wrapper = new EmojiWrapper();
    const text = new EmojiNode(code).setMode('token');
    return text;
    // const decorator = new EmojiDecoratorNode(code);
    // return decorator;
    // wrapper.append(text, decorator);

    // return wrapper;
};

export function $isEmojiNode(node: LexicalNode | null | undefined): node is EmojiNode {
    return node instanceof EmojiNode;
}