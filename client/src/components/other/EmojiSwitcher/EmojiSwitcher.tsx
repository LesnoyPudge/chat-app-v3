import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useState } from 'react';
import { Emoji } from 'src/components/media';



const getRandomEmoji = () => {};

const styles = {
    wrapper: 'w-10 h-10 p-1.5',
    emoji: 'w-full h-full',
};

export const EmojiSwitcher: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const [currentEmoji, setCurrentEmoji] = useState(() => (getRandomEmoji()));

    const switchEmoji = () => {
        console.log('switch!');
        setCurrentEmoji(getRandomEmoji());
    };

    return (
        <div 
            className={twClassNames(styles.wrapper, className)}
            onMouseOver={switchEmoji}
            onFocus={switchEmoji}
        >
            <Emoji
                className={styles.emoji}
                code=':ok:'
            />
        </div>
    );
};