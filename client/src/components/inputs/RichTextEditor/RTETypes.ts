import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { EmojiCode } from '@components';



declare module 'slate' {
    interface CustomTypes {
        Editor: RTETypes.Editor;
        Element: RTETypes.Element;
        Text: RTETypes.Text;
    }
}

export module RTETypes {
    export type Editor = (
        BaseEditor &
        ReactEditor &
        HistoryEditor
    );

    export module Elements {
        export type Paragraph = {
            type: 'paragraph';
            children: RTETypes.Nodes,
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
    }

    export type Element = (
        Elements.Paragraph |
        Elements.Link |
        Elements.Emoji
    );

    export type Text<T extends string = string> = {
        text: T;
        bold?: boolean;
        italic?: boolean;
    }

    export module Helpers {
        export type WithEditor<T = object> = T & {
            editor: RTETypes.Editor;
        }
    }

    export module Plugins {
        export type WithCharacterLimit = {
            maxLength: number;
        }
    }

    export type Node = RTETypes.Element | RTETypes.Text;

    export type Nodes = RTETypes.Node[];
}