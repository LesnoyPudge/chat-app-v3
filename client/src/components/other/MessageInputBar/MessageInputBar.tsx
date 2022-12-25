import { FC } from 'react';
import { SlateEditor, SlateContainer } from '@libs';
import { Button, Icon } from '@components';
import { twClassNames } from '@utils';
import { FileDrop, OpenEmojiPickerButton } from './components';



interface IMessageInputBar {
    className?: string;
    placeholder?: string;
}

const styles = {
    wrapper: `flex min-h-[44px] max-h-[50vh] mt-auto 
    mb-6 mx-4 rounded-lg bg-primary-100`,
    editor: `w-full px-2 h-full py-[11px]
    placeholder:text-placeholder min-h-[44px] max-h-[50vh] 
    overflow-y-auto overflow-x-hidden`,
    button: `h-11 fill-icon-200 hover:fill-icon-300 
    focus-visible:fill-icon-300`,
    icon: 'h-6 w-6',
};

export const MessageInputBar: FC<IMessageInputBar> = ({
    className = '',
    placeholder,
}) => {
    return (
        <>
            <SlateContainer>
                <div className={twClassNames(styles.wrapper, className)}>
                    <Button className={styles.button}>
                        <Icon
                            className={styles.icon}
                            iconId='add-file-icon'
                        />
                    </Button>

                    <SlateEditor
                        className={styles.editor}
                        placeholder={placeholder}
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
            </SlateContainer>

            <FileDrop/>
        </>
    );
};