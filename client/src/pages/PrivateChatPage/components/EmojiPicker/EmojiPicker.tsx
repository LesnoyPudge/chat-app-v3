import { Button, IModalContext, ModalContext, OverlayLayer, SearchBar } from '@components';
import { Emoji, emojiList, useAddEmoji } from '@libs';
import { animated, useTransition } from '@react-spring/web';
import { FC, useContext, useMemo, useState } from 'react';
import ReactFocusLock from 'react-focus-lock';



export const EmojiPicker: FC = () => {
    const { isOpen, closeModal } = useContext(ModalContext) as IModalContext;
    const { addEmoji } = useAddEmoji();
    const [searchValue, setSearchValue] = useState('');
    const [currentEmoji, setCurrentEmoji] = useState(emojiList[0]);
    const transition = useTransition(isOpen, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 50 },
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);
    const handleReset = () => setSearchValue('');

    const emojiListToRender = useMemo(() => {
        return searchValue 
            ? emojiList.filter((item) => {
                return !!item.code.filter((code) => code.match(searchValue.toLowerCase())).length;
            }) 
            : emojiList;
    }, [searchValue]);

    return transition((style, item) => (
        <OverlayLayer isRendered={item}>
            <ReactFocusLock autoFocus={false} returnFocus disabled={!isOpen}>
                <animated.div 
                    className='bg-primary-400 pointer-events-auto flex flex-col 
                    max-h-[40vh] w-[min(300px,100%)] rounded-md p-3 
                    shadow-emoji_picker'
                    style={style}
                >
                    <SearchBar
                        className='h-[30px]'
                        placeholder={currentEmoji.code.join(' ')}
                        value={searchValue}
                        onChange={handleChange}
                        onReset={handleReset}
                    />
                   
                    <ul 
                        className='my-3 p-3 grid grid-cols-5 gap-3 
                        overflow-auto custom-scrollbar-variant-primary'
                    >
                        {
                            emojiListToRender.map((item) => {
                                const handleMouseEnter = () => setCurrentEmoji(item);
                                const handleClick = () => {
                                    closeModal();
                                    setTimeout(() => {
                                        addEmoji(item.code[0]);   
                                    });
                                };

                                return (
                                    <li className='contents' key={item.code[0]}>
                                        <Button
                                            className='h-10 w-10 flex rounded-lg
                                            hover:bg-primary-100 focus-visible:bg-primary-100
                                            transition-all duration-75'
                                            isDefaultStyled={false}
                                            onClick={handleClick}
                                            onMouseEnter={handleMouseEnter}
                                        >
                                            <Emoji 
                                                className='h-8 m-auto' 
                                                isSerialized 
                                                code={item.code[0]}
                                            />
                                        </Button>
                                    </li>
                                );
                            })
                        }
                    </ul>
                    
                    <div className='h-12 flex items-center px-2 bg-primary-500'>
                        <div className='overflow-hidden whitespace-nowrap text-ellipsis'>
                            <Emoji 
                                className='mr-2 h-7'
                                isSerialized 
                                code={currentEmoji.code[0]}
                            />

                            <span className='font-bold'>
                                {currentEmoji.code.join(' ')}
                            </span>
                        </div>
                    </div>
                </animated.div>
            </ReactFocusLock>
        </OverlayLayer>
    ));
};