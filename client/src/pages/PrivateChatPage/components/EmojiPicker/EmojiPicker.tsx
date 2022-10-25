import { Button, IModalContext, IRefContext, ModalContext, OverlayLayer, RefContext, SearchBar } from '@components';
import { Emoji, emojiList, useAddEmoji } from '@libs';
import { animated, useTransition } from '@react-spring/web';
import { fpsToMs, throttle } from '@utils';
import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ReactFocusLock from 'react-focus-lock';



export const EmojiPicker: FC = () => {
    const { target } = useContext(RefContext) as IRefContext;
    const wrapperRef = useRef<HTMLDivElement | null>(null);
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
    
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = throttle(() => {
            if (!wrapperRef.current) return;
            if (!target.current) return;
            const top = target.current.getBoundingClientRect().top;
            wrapperRef.current.style.top = `${top}px`;
        }, fpsToMs(60));

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen, target]);

    useEffect(() => {
        if (!isOpen) return;
        if (!wrapperRef.current) return;

        const wrapper = wrapperRef.current;
        const stopPropagation = (e: Event) => e.stopPropagation();
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.code === 'Escape') closeModal();
        };

        document.addEventListener('click', closeModal);
        document.addEventListener('keydown', handleKeydown);
        wrapper.addEventListener('click', stopPropagation);

        return () => {
            document.removeEventListener('click', closeModal);
            document.removeEventListener('keydown', handleKeydown);
            wrapper.removeEventListener('click', stopPropagation);
        };
    }, [closeModal, isOpen]);

    return transition((style, item) => {
        if (!target.current) return null;
        const rect = target.current.getBoundingClientRect();
        const wrapperStyle = {
            opacity: style.opacity,
            translateY: '-100%',
            top: `${rect.top}px`,
            right: 0,
        };

        return (
            <OverlayLayer isRendered={item}>
                <ReactFocusLock autoFocus={false} returnFocus disabled={!isOpen}>
                    <animated.div 
                        className='bg-primary-400 pointer-events-auto flex flex-col 
                        max-h-[40vh] w-[min(300px,100%)] rounded-md p-3 ml-auto
                        shadow-emoji_picker absolute'
                        style={wrapperStyle}
                        ref={wrapperRef}
                    >
                        <SearchBar
                            className='h-[30px]'
                            placeholder={currentEmoji.code.join(' ')}
                            value={searchValue}
                            onChange={handleChange}
                            onReset={handleReset}
                        />
                   
                        <ul 
                            className='my-3 py-2 pl-2 grid grid-cols-5 gap-3 
                            overflow-auto custom-scrollbar-variant-primary'
                        >
                            {
                                emojiListToRender.map((item) => {
                                    const changeCurrentEmoji = () => setCurrentEmoji(item);
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
                                                isntStyled
                                                onClick={handleClick}
                                                onMouseEnter={changeCurrentEmoji}
                                                onFocus={changeCurrentEmoji}
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
        );
    });
};