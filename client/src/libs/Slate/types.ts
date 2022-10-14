import { BaseEditor, ExtendedType } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { EmojiCodeType } from './components';



export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type ParagraphElement = {
    type: 'paragraph';
    children: CustomText[];
}

export type EmojiElement = {
    type: 'emoji';
    code: EmojiCodeType;
    children: [{text: ''}];
}

export type LinkElement = {
    type: 'link';
    url: string;
    children: [{text: string}];
}

export type CustomElement = ParagraphElement | LinkElement | EmojiElement;

export type CustomText = { 
    text: string; 
    bold?: boolean;
    italic?: boolean;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

export type CustomRenderElementProps<T = CustomElement> = Omit<RenderElementProps, 'element'> & {
    element: T;
}

export interface RenderElementAttributes {
    'data-slate-node': 'element';
    'data-slate-inline'?: true | undefined;
    'data-slate-void'?: true | undefined;
    dir?: 'rtl' | undefined;
    ref: any;
}