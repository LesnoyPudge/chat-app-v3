import classNames from 'classnames';
import { FC } from 'react';
import { SlateEditor, SlateContainer } from '@libs';
import { twMerge } from 'tailwind-merge';
import { EmojiPickerButton } from '..';



interface IMessageInputBar {
    className?: string;
    placeholder?: string;
}

const baseWrapperClassName = `flex min-h-[44px] max-h-[50vh] mt-auto 
mb-6 mx-4 rounded-lg bg-primary-100 overflow-y-auto custom-scrollbar-variant-primary`;

const editorClassName = `w-full my-auto py-[11px] px-2 
placeholder:text-placeholder min-h-[44px]`;

export const MessageInputBar: FC<IMessageInputBar> = ({
    className = '',
    placeholder,
}) => {
    return (
        <SlateContainer>
            <div className={twMerge(classNames(baseWrapperClassName, className))}>
                <button className='h-11'>attach</button>

                <SlateEditor
                    className={twMerge(editorClassName)}
                    placeholder={placeholder}
                />
                
                <EmojiPickerButton/>

                <button 
                    className='h-11'
                >
                    send
                </button>
            </div>
        </SlateContainer>
    );
};