import { Button, Emoji, EmojiCode, emojiList, List, Scrollable, SearchBar } from '@components';
import { useTextInput } from '@hooks';
import { PropsWithClassName } from '@types';
import { conditional, getRandomNumber, twClassNames } from '@utils';
import { FC, useMemo, useState } from 'react';



interface EmojiPicker extends PropsWithClassName {
    onEmojiPick: (code: EmojiCode) => void;
}

const styles = {
    wrapper: `bg-primary-400 pointer-events-auto flex flex-col 
    h-[min(300px,100vh)] w-[min(300px,100vw)] rounded-md
    shadow-elevation-high`,
    scrollable: 'my-3',
    scrollableInner: 'h-full',
    notFound: 'flex items-center justify-center h-full text-sm font-medium',
    searchBar: 'h-[30px] m-3 w-auto',
    emojiList: 'py-2 pl-2 grid grid-cols-5 gap-3',
    emojiListButton: `h-10 w-10 flex rounded-lg
    hover:bg-primary-100 focus-visible:bg-primary-100
    transition-all duration-75`,
    emojiListEmoji: 'h-8 m-auto',
    previewWrapper: 'h-12 flex items-center px-2 bg-primary-500',
    previewEmoji: 'mr-2 h-7 w-7',
    previewText: 'font-bold truncated',
};

export const EmojiPicker: FC<EmojiPicker> = ({
    className = '',
    onEmojiPick,
}) => {
    const { value, deferredValue, handleChange, handleReset } = useTextInput();
    const [currentEmoji, setCurrentEmoji] = useState(emojiList[getRandomNumber(0, emojiList.length - 1)]);

    const filteredList = useMemo(() => emojiList.filter((emoji) => {
        return !!emoji.code.filter((code) => code.match(deferredValue.toLowerCase())).length;
    }), [deferredValue]);

    const emojiListToRender = conditional(filteredList, emojiList, !!deferredValue);
    const emojiCode = currentEmoji.code[0];
    const emojiCodes = currentEmoji.code.join(' ');

    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <SearchBar
                className={styles.searchBar}
                label='Поиск эмодзи'
                placeholder={emojiCodes}
                value={value}
                onChange={handleChange}
                onReset={handleReset}
            />

            <Scrollable className={styles.scrollable}>
                <div className={styles.scrollableInner}>
                    <If condition={!!emojiListToRender.length}>
                        <ul className={styles.emojiList}>
                            <List list={emojiListToRender}>
                                {(emoji) => {
                                    const emojiCode = emoji.code[0];

                                    const changeCurrentEmoji = () => setCurrentEmoji(emoji);
                                    const handleClick = () => onEmojiPick(emojiCode);

                                    return (
                                        <li>
                                            <Button
                                                className={styles.emojiListButton}
                                                label={`Выбрать эмодзи ${emoji.label}`}
                                                onLeftClick={handleClick}
                                                onMouseEnter={changeCurrentEmoji}
                                                onFocus={changeCurrentEmoji}
                                            >
                                                <Emoji
                                                    className={styles.emojiListEmoji}
                                                    code={emojiCode}
                                                />
                                            </Button>
                                        </li>
                                    );
                                }}
                            </List>
                        </ul>
                    </If>

                    <If condition={!emojiListToRender.length}>
                        <div className={styles.notFound}>
                            <div>Эмодзи не найдены</div>
                        </div>
                    </If>
                </div>
            </Scrollable>

            <div className={styles.previewWrapper}>
                <Emoji
                    className={styles.previewEmoji}
                    code={emojiCode}
                />

                <span className={styles.previewText}>
                    {emojiCodes}
                </span>
            </div>
        </div>
    );
};