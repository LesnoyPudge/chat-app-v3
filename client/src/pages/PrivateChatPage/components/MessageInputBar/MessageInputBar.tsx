import classNames from 'classnames';
import { FC } from 'react';
import { SlateEditor, SlateContainer } from '@libs';
import { twMerge } from 'tailwind-merge';
import { EmojiPickerButton } from '..';
import { Button, Icon } from '@components';



interface IMessageInputBar {
    className?: string;
    placeholder?: string;
}

const baseWrapperClassName = `flex min-h-[44px] max-h-[50vh] mt-auto 
mb-6 mx-4 rounded-lg bg-primary-100 overflow-y-auto `;

const editorClassName = `w-full my-auto py-[11px] px-2 
placeholder:text-placeholder min-h-[44px]`;

export const MessageInputBar: FC<IMessageInputBar> = ({
    className = '',
    placeholder,
}) => {
    return (
        <SlateContainer>
            <div className={twMerge(classNames(baseWrapperClassName, className))}>
                <Button 
                    className='h-11 fill-icon-100 hover:fill-icon-200 
                    focus-visible:fill-icon-200'
                >
                    <Icon
                        iconId='add-file-icon'
                        height={24}
                    />
                </Button>

                <SlateEditor
                    className={twMerge(editorClassName)}
                    placeholder={placeholder}
                />
                
                <EmojiPickerButton
                    className='h-11'
                />

                <Button 
                    className='h-11 fill-icon-100 hover:fill-icon-200 
                    focus-visible:fill-icon-200'
                    type='submit'
                >
                    <Icon
                        iconId='send-message-icon'
                        height={24}
                    />
                </Button>
            </div>
        </SlateContainer>
    );
};