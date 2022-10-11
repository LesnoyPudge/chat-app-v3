import { BaseEditor, ExtendedType } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { EmojiCodeType } from './components';



export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type EmojiElement = {
    type: 'emoji';
    code: EmojiCodeType;
    children: [{text: ''}];
}

export type ParagraphElement = {
  type: 'paragraph';
  children: CustomText[];
}

export type LinkElement = {
    type: 'link';
    url: string;
    children: CustomText[];
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