import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { SlateEditor, SlateContainer, FormikFileInput } from '@libs';
import { Button, Icon, MessageEditorWrapper, RefContextProvider, Scrollable } from '@components';
import { twClassNames } from '@utils';
import { FileDrop, OpenEmojiPickerButton } from './components';
import { useFocus } from '@hooks';
import { ReactEditor, useFocused, useSlateStatic } from 'slate-react';
import useResizeObserver from '@react-hook/resize-observer';



interface IMessageInputBar {
    className?: string;
    placeholder?: string;
}

const styles = {
    wrapper: `flex min-h-[44px] max-h-[50vh] mt-auto 
    mb-6 mx-4 rounded-lg bg-primary-100`,
    editor: 'w-full px-2 h-full py-[11px] min-h-[44px] max-h-[50vh]',
    button: `h-11 w-11 fill-icon-200 hover:fill-icon-300 
    focus-visible:fill-icon-300`,
    icon: 'h-6 w-6',
};

export const MessageInputBar: FC<IMessageInputBar> = ({
    className = '',
    placeholder,
}) => {
    const styles2 = {
        button: 'group/button w-11 h-11 p-2.5 sticky top-0 rounded-lg shrink-0',
        icon: `w-full h-full fill-icon-200 group-hover/button:fill-icon-100 
        group-focus-visible/button:fill-icon-100`,

    };

    return (
        <>
            <SlateContainer>
                <MessageEditorWrapper>
                    {/* <FormikFileInput label='' name=''></FormikFileInput> */}
                    
                    <Button 
                        className={styles2.button}
                    
                    >
                        <Icon
                            className={styles2.icon}
                            iconId='add-file-icon'
                        />
                    </Button> 

                    <SlateEditor
                        placeholder={placeholder}
                        label='Введите сообщение'
                        onSubmit={() => console.log('submit!!')}
                    />

                    <button className='w-11 h-11 bg-lime-600 sticky top-0 rounded-lg shrink-0'>btn</button>

                    <button className='w-11 h-11 bg-lime-600 sticky top-0 rounded-lg shrink-0'>btn</button>
                </MessageEditorWrapper>
            </SlateContainer>

            <FileDrop/>
        </>
    );
};

const MessageInputBarInner: FC<IMessageInputBar> = ({
    className = '',
    placeholder,
}) => {
    const isEditorFocused = useFocused();

    return (
        <div className={twClassNames(
            'flex mb-6 mx-4 rounded-lg bg-primary-100 max-h-[50vh] overflow-y-auto overflow-x-hidden',
            { 'focused': isEditorFocused },
        )}>
            <Button className={styles.button}>
                <Icon
                    className={styles.icon}
                    iconId='add-file-icon'
                />
            </Button> 
                    
            <SlateEditor
                className={'px-2 h-full py-[11px]'}
                placeholder={placeholder}
                label='Введите сообщение'
                onSubmit={() => console.log('submit!!')}
            />

            <OpenEmojiPickerButton className='h-11'/>

            <Button 
                className={styles.button}
                type='submit'
            >
                <Icon
                    className={styles.icon}
                    iconId='send-message-icon'
                />
            </Button>
        </div>
    );
};