import { Button, Emoji, emojiList, Scrollable, SearchBar } from '@components';
import { useSearch } from '@hooks';
import { useSlateAddEmoji } from '@libs';
import { PropsWithClassName } from '@types';
import { conditional, getRandomNumber, twClassNames } from '@utils';
import { FC, useMemo, useState } from 'react';



const styles = {
    wrapper: `bg-primary-400 pointer-events-auto flex flex-col 
    max-h-[40vh] w-[min(300px,100vw)] rounded-md
    shadow-elevation-high`,
    searchBar: 'h-[30px] m-3 w-auto',
    emojiList: 'my-3 py-2 pl-2 grid grid-cols-5 gap-3',
    emojiListButton: `h-10 w-10 flex rounded-lg
    hover:bg-primary-100 focus-visible:bg-primary-100
    transition-all duration-75`,
    emojiListEmoji: 'h-8 m-auto',
    previewWrapper: 'h-12 flex items-center px-2 bg-primary-500',
    previewEmoji: 'mr-2 h-7 w-7',
    previewText: 'font-bold truncated',
};

export const EmojiPicker: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { addEmoji } = useSlateAddEmoji();
    const { searchValue, handleChange, handleReset } = useSearch();
    const [currentEmoji, setCurrentEmoji] = useState(emojiList[getRandomNumber(0, emojiList.length - 1)]);

    const filteredList = useMemo(() => emojiList.filter((emoji) => {
        return !!emoji.code.filter((code) => code.match(searchValue.toLowerCase())).length;
    }), [searchValue]);

    const emojiListToRender = conditional(filteredList, emojiList, !!searchValue);
    const emojiCode = currentEmoji.code[0];
    const emojiCodes = currentEmoji.code.join(' ');

    return (      
        <div className={twClassNames(styles.wrapper, className)}>
            <SearchBar
                className={styles.searchBar}
                label='Поиск эмоджи'
                placeholder={emojiCodes}
                value={searchValue}
                onChange={handleChange}
                onReset={handleReset}
            />

            <Scrollable>
                <ul className={styles.emojiList}>
                    {
                        emojiListToRender.map((emoji) => {
                            const emojiCode = emoji.code[0];

                            const changeCurrentEmoji = () => setCurrentEmoji(emoji);
                            const handleClick = () => addEmoji(emojiCode);

                            return (
                                <li key={emojiCode}>
                                    <Button
                                        className={styles.emojiListButton}
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
                        })
                    }
                </ul>
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