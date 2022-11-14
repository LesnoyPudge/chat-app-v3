import { Button, ModalContextProvider, RefContextProvider } from '@components';
import { Emoji, uniqueEmojiCodeList } from '@libs';
import { getOneOf, twClassNames } from '@utils';
import { FC, useState } from 'react';
import { EmojiPicker } from './components';



interface IEmojiPickerButton {
    className?: string;
}

const emojiBaseClassName = `m-auto transition-all grayscale group-hover:grayscale-0 group-hover:scale-[1.14]
group-focus-visible:grayscale-0 group-focus-visible:scale-[1.14]`;
const emojiActiveClassName = 'grayscale-0 scale-[1.14]';

export const OpenEmojiPickerButton: FC<IEmojiPickerButton> = ({
    className = '',
}) => {
    const [emojiCode, setEmojiCode] = useState(getOneOf(uniqueEmojiCodeList));

    return (
        <ModalContextProvider>
            {({ toggleModal, isOpen }) => {
                const changeEmojiCode = () => !isOpen && setEmojiCode(getOneOf(uniqueEmojiCodeList));
            
                return (
                    <RefContextProvider>
                        <Button
                            className={twClassNames('group', className)}
                            onClick={toggleModal} 
                            onMouseEnter={changeEmojiCode}
                        >
                            <Emoji
                                className={twClassNames(
                                    emojiBaseClassName, 
                                    { [emojiActiveClassName]: isOpen },
                                )}
                                code={emojiCode}
                                isSerialized
                            />
                        </Button>
            
                        <EmojiPicker/>
                    </RefContextProvider>
                );
            }}
        </ModalContextProvider>
    );
};