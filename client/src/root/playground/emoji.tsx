import { EmojiCode, EmojiItem } from '@components';
import { SerializedTextNode, TextNode, NodeKey, LexicalEditor, DOMExportOutput, LexicalNode, EditorConfig } from 'lexical';



type SerializedEmojiNode = SerializedTextNode & {
    code: EmojiCode;
    emojiItem: EmojiItem;
}

const styles = {
    base: `inline-block message-emoji-wrapper-size 
    message-emoji-font-size message-emoji-bg-size bg-center 
    bg-no-repeat overflow-hidden align-bottom caret-base 
    font-mono text-transparent selection:text-transparent 
    selection:bg-selection`,
};

export class EmojiNode extends TextNode {
    __code: EmojiCode;
    __emojiItem: EmojiItem;

    constructor(code: EmojiCode, emojiItem: EmojiItem, key?: NodeKey) {
        super(emojiItem.label, key);
        this.__code = code;
        this.__emojiItem = emojiItem;
    }

    static getType(): string {
        return 'emoji';
    }

    static clone(node: EmojiNode): EmojiNode {
        return new EmojiNode(node.__code, node.__emojiItem, node.__key);
    }

    exportJSON(): SerializedEmojiNode {
        return {
            ...super.exportJSON(),
            code: this.__code,
            emojiItem: this.__emojiItem,
            text: this.__text,
            mode: 'token',
            type: this.getType(),
            version: 1,
        };
    }

    updateDOM(
        prevNode: TextNode,
        dom: HTMLElement,
        config: EditorConfig,
    ) {
        super.updateDOM(prevNode, dom, config);
        return false;
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {

        const element = this.createDOM(editor._config);
        // const element = htmlStringToElement(renderToString(
        //     <div className='inline-block relative'>
        //         <div>
        //             {this.__emojiItem.label}
        //         </div>

        //         <div
        //             className='absolute right-0 pointer-events-none'
        //             contentEditable={false}
        //         >
        //             {this.__code}
        //         </div>
        //     </div>,
        // ));

        return {
            element,
        };
    }

    createDOM(config: EditorConfig) {
        const dom = super.createDOM(config);

        dom.className = styles.base;
        dom.style.backgroundImage = `url("${this.__emojiItem.path.replaceAll('\\', '/')}")`;

        return dom;
    }
}

export const $createEmojiNode = (code: EmojiCode, emoji: EmojiItem) => {
    return new EmojiNode(code, emoji).setMode('token');
};

export function $isEmojiNode(node: LexicalNode | null | undefined): node is EmojiNode {
    return node instanceof EmojiNode;
}