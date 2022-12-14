import { Button, Emoji, emojiList, SearchBar } from '@components';
import { useSlateAddEmoji } from '@libs';
import { PropsWithClassName } from '@types';
import { conditional, getRandomNumber, twClassNames } from '@utils';
import { FC, useMemo, useState } from 'react';



const styles = {
    wrapper: `bg-primary-400 pointer-events-auto flex flex-col 
    max-h-[40vh] w-[min(300px,100%)] rounded-md
    shadow-elevation-high`,
    searchBar: 'h-[30px] m-3 w-auto',
    emojiList: `my-3 py-2 pl-2 grid grid-cols-5 gap-3 
    overflow-auto custom-scrollbar-variant-primary`,
    emojiListButton: `h-10 w-10 flex rounded-lg
    hover:bg-primary-100 focus-visible:bg-primary-100
    transition-all duration-75`,
    emojiListEmoji: 'h-8 m-auto',
    previewWrapper: 'h-12 flex items-center px-2 bg-primary-500',
    previewEmoji: 'mr-2 h-7 w-7',
    previewText: 'font-bold whitespace-nowrap text-ellipsis overflow-hidden w-full',
};
// overflow-hidden whitespace-nowrap text-ellipsis
export const EmojiPicker: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { addEmoji } = useSlateAddEmoji();
    const [searchValue, setSearchValue] = useState('');
    const [currentEmoji, setCurrentEmoji] = useState(emojiList[getRandomNumber(0, emojiList.length - 1)]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value.toLowerCase());
    };
    const handleReset = () => setSearchValue('');

    const filteredList = useMemo(() => emojiList.filter((emoji) => {
        return !!emoji.code.filter((code) => code.match(searchValue)).length;
    }), [searchValue]);

    const emojiListToRender = conditional(filteredList, emojiList, !!searchValue);
    const emojiCode = currentEmoji.code[0];
    const emojiCodes = currentEmoji.code.join(' ');

    return (
        <>
            <div className={twClassNames(`bg-primary-400 pointer-events-auto 
            flex flex-col rounded-md shadow-elevation-high w-[min(300px,100%)]`, className)}>
                <SearchBar
                    className={styles.searchBar}
                    placeholder={emojiCodes}
                    value={searchValue}
                    onChange={handleChange}
                    onReset={handleReset}
                />
                   
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
                    
                <div className={styles.previewWrapper}>
                    <Emoji 
                        className={styles.previewEmoji}
                        code={emojiCode}
                    />

                    <div className='relative w-full h-auto'>
                        <div className={' text-ellipsis whitespace-nowrap overflow-hidden bg-rose-600'}>
                            <>{emojiCodes + ' qwdqweqwe qweqwewqeqweqwe'}</>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


// import { Button, Emoji, emojiList, SearchBar } from '@components';
// import { useSlateAddEmoji } from '@libs';
// import { PropsWithClassName } from '@types';
// import { twClassNames } from '@utils';
// import { FC, useMemo, useState } from 'react';



// const styles = {
//     wrapper: `bg-primary-400 pointer-events-auto flex flex-col 
//     max-h-[40vh] w-[min(300px,100%)] rounded-md p-3 ml-auto
//     shadow-elevation-high`,
//     searchBar: 'h-[30px]',
//     emojiList: `my-3 py-2 pl-2 grid grid-cols-5 gap-3 
//     overflow-auto custom-scrollbar-variant-primary`,
//     emojiListButton: `h-10 w-10 flex rounded-lg
//     hover:bg-primary-100 focus-visible:bg-primary-100
//     transition-all duration-75`,
//     emojiListEmoji: 'h-8 w-8 m-auto',
//     previewWrapper: 'h-12 flex items-center px-2 bg-primary-500 overflow-hidden whitespace-nowrap text-ellipsis',
//     previewInner: 'overflow-hidden whitespace-nowrap text-ellipsis',
//     previewEmoji: 'mr-2 h-7',
//     previewText: 'font-bold',
// };

// export const EmojiPicker: FC<PropsWithClassName> = ({
//     className = '',
// }) => {
//     const { addEmoji } = useSlateAddEmoji();
//     const [searchValue, setSearchValue] = useState('');
//     const [currentEmoji, setCurrentEmoji] = useState(emojiList[0]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchValue(e.target.value.toLowerCase());
//     };
//     const handleReset = () => setSearchValue('');

//     const emojiListToRender = useMemo(() => {
//         return searchValue 
//             ? emojiList.filter((emoji) => {
//                 return !!emoji.code.filter((code) => code.match(searchValue)).length;
//             }) 
//             : emojiList;
//     }, [searchValue]);

//     return (
//         <>
//             <div className={twClassNames(styles.wrapper, className)}>
//                 <SearchBar
//                     className={styles.searchBar}
//                     placeholder={currentEmoji.code.join(' ')}
//                     value={searchValue}
//                     onChange={handleChange}
//                     onReset={handleReset}
//                 />
                   
//                 <ul className={styles.emojiList}>
//                     {
//                         emojiListToRender.map((emoji) => {
//                             const emojiCode = emoji.code[0];

//                             const changeCurrentEmoji = () => setCurrentEmoji(emoji);
//                             const handleClick = () => addEmoji(emojiCode);

//                             return (
//                                 <li key={emojiCode}>
//                                     <Button
//                                         className={styles.emojiListButton}
//                                         onLeftClick={handleClick}
//                                         onMouseEnter={changeCurrentEmoji}
//                                         onFocus={changeCurrentEmoji}
//                                     >
//                                         <Emoji 
//                                             className={styles.emojiListEmoji}
//                                             code={emojiCode}
//                                         />
//                                     </Button>
//                                 </li>
//                             );
//                         })
//                     }
//                 </ul>
                    
//                 <div className={styles.previewWrapper}>
//                     <div className={styles.previewInner}>
//                         <Emoji 
//                             className={styles.previewEmoji}
//                             code={currentEmoji.code[0]}
//                         />

//                         <span className={styles.previewText}>
//                             {currentEmoji.code.join(' ')} {'qweqweqweqweqwdqwdqwdqwdqwdq'}
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };