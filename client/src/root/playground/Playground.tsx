import { Image, ChannelSettingsModal, Conditional, OverlayContextProvider, AppSettingsModal, ColorPicker, Scrollable, CreateRoomModal, InviteToChannelModal, ChildrenAsNodeOrFunction, List, SearchBar, BanMemberModal, KickMemberModal, ChangeChannelOwnerModal, BlockUserModal, AddMemberToRoleModal, DeleteRoleModal, AddFriendModal, RoomSettingsModal, FindChannelModal, EmojiPicker, uniqueEmojiCodeList, EmojiCode , Message, RefContext, RefContextProvider, Button, ModalWindow } from '@components';
import { useInView } from '@react-spring/web';
import { EncodedFile, PropsWithChildrenAndClassName, PropsWithChildrenAsNodeOrFunction } from '@types';
import { getHTML, noop, throttle, twClassNames } from '@utils';
import { CSSProperties, FC, MutableRefObject, PropsWithChildren, useContext, useDeferredValue, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Attachments, OpenEmojiPickerButton } from 'src/components/other/MessageInputBar/components';
import { useElementSize, useEventListener, useHover, useImageOnLoad, useToggle, useUpdateEffect } from 'usehooks-ts';
import { VariableSizeList } from 'react-window';
import { useFileDrop, useTextInput, useThrottle } from '@hooks';
import { ViewportList } from 'react-viewport-list';
import SimpleBarCore from 'simplebar-core';



interface ImageV2 extends PropsWithChildren {
    src?: string;
    file?: EncodedFile;
    alt?: string;
}

interface ImageState {
    loading: boolean;
    error: boolean;
}

const states = {
    loading: {
        loading: true,
        error: false,
    },
    error: {
        loading: false,
        error: true,
    },
    success: {
        loading: false,
        error: false,
    },
} satisfies Record<string, ImageState>;

const ImageV2: FC<ImageV2> = ({
    src,
    file,
    alt,
    children,
}) => {
    const [imageState, setImageState] = useState<ImageState>(states.loading);

    const handleLoad = () => {
        console.log('load');
        setImageState(states.success);
    };

    const handleError = () => {
        console.log('error');
        setImageState(states.error);
    };

    useEffect(() => {
        if (!src && !file) return;


    }, [src, file]);

    const withPlaceholder = !!children;

    return (
        <>
            <div>
                <>loading: {`${imageState.loading}`} error: {`${imageState.error}`}</>
            </div>
            
            <div>
                <picture>
                    {/* <source srcSet='image.avif' type='image/avif'/> */}
                    {/* <source srcSet='image.webp' type='image/webp'/> */}
                    {/* <source srcSet='large.png' media='(min-width: 1000px)'/> */}
                    {/* <source srcSet='medium.png 1x, large.png 2x' media='(min-width: 500px)'/> */}

                    <img
                        className={twClassNames(
                            'w-[600px] h-[600px] border-2 border-red-700 transition-all duration-200 mx-auto my-10 resize',
                            { 'opacity-0 pointer-events-none': imageState.loading },
                        )}
                        src='https://picsum.photos/400/200'
                        alt={alt}
                        loading='lazy'
                        decoding='async'
                        contentEditable='false'
                        draggable='false'
                        onLoad={handleLoad}
                        onError={handleError}
                    />
                </picture>

                <Conditional isRendered={imageState.loading}>
                    <div className='absolute inset-0 bg-lime-500'>
                    </div>
                </Conditional>
            </div>
        </>
    );
};


interface Virtual extends PropsWithChildrenAsNodeOrFunction<{i: string}> {
    list: {id: string}[]
}

const Virtual: FC<Virtual> = ({ 
    list,
    children, 
}) => {
    const listLength = list.length;
    const height = 937;
    const itemHeight = 45;
    const overflowItems = 10;
    const itemsInView = Math.floor(Math.min((height / itemHeight) + overflowItems, listLength));

    const [renderRange, setRenderRange] = useState({ start: 0, finish: itemsInView });

    const handleInView = (index: number, position: 'top' | 'bottom' | null) => {
        console.log('trigger', index, position);
        if (!position) return;
        if (renderRange.start === 0 && position === 'top') return;
        if (renderRange.finish === listLength && position === 'bottom') return;

        console.log(`item ${index} in view!`);
        
        // setRenderRange(prevRange => ({
        //     start: Math.max(prevRange.start - overflowItems, 0),
        //     finish: Math.min(prevRange.finish + overflowItems, list.length - 1),
        // }));

        const posTop = position === 'top';

        setRenderRange((prevRange) => ({
            start: Math.min(Math.max(prevRange.start + (posTop ? -5 : 5), 0), listLength - 30),
            finish: Math.min(Math.max(prevRange.finish + (posTop ? -5 : 5), 30), listLength),
        }));
    };

    // useEffect(() => {
    //     setTimeout(() => {
    //         setRenderRange(prev => ({ ...prev, finish: prev.finish + 10 }));
    //     }, 2000);
    // }, []);

    const listToRender = list.slice(renderRange.start, renderRange.finish);

    const heightBefore = renderRange.start * itemHeight;
    const heightAfter = (listLength - renderRange.finish) * itemHeight;

    const [topRef, inViewTop] = useInView();
    const [bottomRef, inViewBottom] = useInView();

    

    const ref1 = useRef<HTMLDivElement>(null);
    const ref2 = useRef<HTMLDivElement>(null);
    const renderRangeRef = useRef(renderRange);
    useEffect(() => {
        if (!ref1.current || !ref2.current) return;

        const obs1 = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
            if (!entry.isIntersecting) return;
            if (renderRangeRef.current.start === 0) return;
            
            console.log('top');
            
            const newRange = {
                start: Math.min(Math.max(renderRangeRef.current.start - 5, 0), listLength - 30),
                finish: Math.min(Math.max(renderRangeRef.current.finish - 5, 30), listLength),
            };

            setRenderRange(newRange);
            renderRangeRef.current = newRange;
        });
        const obs2 = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
            if (!entry.isIntersecting) return;
            if (renderRange.finish === listLength) return;
        
            console.log('trigger bottom');

            const newRange = {
                start: Math.min(Math.max(renderRangeRef.current.start + 5, 0), listLength - 30),
                finish: Math.min(Math.max(renderRangeRef.current.finish + 5, 30), listLength),
            };

            setRenderRange(newRange);
            renderRangeRef.current = newRange;
        });

        // const target1 = ref1.current;
        // const target2 = ref2.current;

        obs1.observe(ref1.current);
        obs2.observe(ref2.current);

        return () => {
            obs1.disconnect();
            obs2.disconnect();
        };
    }, []);


    useEffect(() => {
        if (!inViewTop) return;
        if (renderRange.start === 0 && inViewTop) return;
        
        console.log('trigger top');
        setRenderRange((prevRange) => ({
            start: Math.min(Math.max(prevRange.start - 5, 0), listLength - 30),
            finish: Math.min(Math.max(prevRange.finish - 5, 30), listLength),
        }));
        // console.log(renderRange);
    }, [inViewTop]);

    useEffect(() => {
        if (!inViewBottom) return;
        if (renderRange.finish === listLength && inViewBottom) return;

        console.log('trigger bottom');
        setRenderRange((prevRange) => ({
            start: Math.min(Math.max(prevRange.start + 5, 0), listLength - 30),
            finish: Math.min(Math.max(prevRange.finish + 5, 30), listLength),
        }));
    }, [inViewBottom]);
    
    const docRef = useRef(document);

    useEventListener('scroll', () => {
        console.log('scroll!');
    }, docRef);

    return (
        <>
            <div style={{ height: heightBefore }} ref={ref1}></div>

            {/* <div className='w-px h-px bg-red-600' ref={topRef}></div> */}

            {listToRender.map((item, index) => {
                return (
                    <ChildrenAsNodeOrFunction args={{ i: item.id }} key={item.id}>
                        {children}
                    </ChildrenAsNodeOrFunction>
                );
            })}

            {/* <div className='w-px h-px bg-red-600' ref={bottomRef}></div> */}

            <div style={{ height: heightAfter }} ref={ref2}></div>
        </>
    );
};

interface Item extends PropsWithChildren {
    observe: boolean;
    onInView: () => void;
}

const Item: FC<Item> = ({ 
    observe,
    children,
    onInView,
}) => {
    const [ref, inView] = useInView({});
    const isTriggeredRef = useRef(false);
    
    useUpdateEffect(() => {
        if (!observe) return;
        if (!inView) return;
        // if (isTriggeredRef.current) return;

        // isTriggeredRef.current = true;
        onInView();
    }, [inView, onInView]);

    return (
        <div ref={ref}>
            {children}
        </div>
    );
};

const PlaygroundInner: FC = () => {
    const [isRendered, toggleIsRendered] = useToggle(true);

    const ref = useRef<any>(null);

    const handleClick = () => {
        if (!ref.current) return;
        const target = ref.current.contentWrapperEl as HTMLDivElement;
        target.scrollTo({ top: target.scrollHeight, behavior: 'smooth' });
    };

    useEffect(() => {
        if (!ref.current) return;
        const element = ref.current.contentWrapperEl as HTMLDivElement;
        const handleScroll = (e: Event) => {
            const target = e.target as HTMLDivElement;
            console.log('scroll');
        };

        element.addEventListener('scroll', handleScroll);
        return () => {
            element.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const list = [...Array(600)].map((_, i) => ({
        id: i.toString(),
    }));

    return (
        <>
            <OverlayContextProvider isOverlayExistInitial={true}>
            </OverlayContextProvider>

            {/* <button onClick={handleClick}>click</button> */}

            <div 
                className='h-full overflow-y-scroll' 
            // scrollableRef={(el) => ref.current = el}
            >
                <div className='flex flex-col gap-5'>
                    <Virtual list={list}>
                        {({ i }) => (
                            <div>
                                <>wow {i}</>
                            </div>
                        )}
                    </Virtual>

                    {/* <VariableSizeList 
                        height={978} 
                        itemCount={list.length}
                        width='100%'
                        itemSize={() => 45}
                    >
                        {({ index, style }) => (
                            <div style={style}>
                                <>wow {index}</>
                            </div>
                        )}
                    </VariableSizeList> */}
                </div>
            </div>


            <Conditional isRendered={false}>
                <div>
                    <button onClick={toggleIsRendered}>
                        <>toggle</>
                    </button>

                    <Conditional isRendered={isRendered}>
                        <ImageV2/>
                    </Conditional>

                    <div>
                    wow
                    </div>

                    {/* <Image
                    className='w-[300px] h-[300px]'
                    src={'https://picsum.photos/300'}
                /> */}
                </div>
            </Conditional>
        </>
    );
};

const list = [...Array(9)].map((_, i) => ({ id: `key ${i}`, some: `some ${i}` }));

const createList = (value: string) => [...Array(500000)].map((_, index) => ({
    id: index.toString(),
    some: `${value} ${index}`,
}));
import { useWorker } from '@koale/useworker';


// import { createWorkerFactory, useWorker,  } from '@shopify/react-web-worker';



// const createWorker = createWorkerFactory(createList);

const PlaygroundInner2: FC = () => {
    const { deferredValue, value, handleChange, handleReset } = useTextInput();
    const [createListWorker, { status, kill }] = useWorker(createList);
    // const asyncList = useAsync(createListWorker);
    // const createdList = useMemo(() => (
    //     Array(500000).fill('').map((_, index) => {
    //         return {
    //             id: index.toString(), 
    //             some: `${deferredValue} ${index}`,
    //         };
    //     })
    // ), [deferredValue]);
    

    const [valueList, setValue] = useState<{id: string, some: string}[]>(() => createList(''));

    useEffect(() => {
        if (status === 'RUNNING') kill();
        
        const dod = async() => {
            kill();
            console.log(status);
            if (status === 'RUNNING') return kill();
            
            const v = await createListWorker(deferredValue);
            setValue(v);
        };

        dod();

        return () => {
            console.log('kill');
            kill();
        };
    }, [createListWorker, deferredValue, kill]);


    // useEffect(() => console.log('update', filteredList2.length), [filteredList2]);
    const ref = useRef<HTMLDivElement | null>(null);
    return (
        <>
            <SearchBar
                value={value}
                label=''
                onChange={handleChange}
                onReset={handleReset}
            />

            <Scrollable className='h-[800px]' scrollableRef={ref}>
                {/* <List list={createdList}>
                    {({ some }) => (
                        <div>
                            {some}
                        </div>
                    )}
                </List> */}
                <div className='relative flex flex-col space-y-5'>
                    <ViewportList
                        viewportRef={ref}
                        items={valueList}
                        overscan={5}
                    >
                        {(item) => (
                            <div key={item.id}>
                                {item.some}
                            </div>
                        )}
                    </ViewportList>
                </div>
            </Scrollable>

            {/* <List list={filteredList}>
                {(item, index, array) => (
                    <div>
                        {item.some}
                    </div>
                )}
            </List> */}

            {/* <Scrollable className='h-full' scrollableRef={(el) => ref.current = el}>
                <div className='flex flex-col'>
                    <ViewportList
                        viewportRef={ref}
                        items={filteredList}
                        overscan={5}
                    >
                        {(item) => (
                            <div key={item.id}>
                                {item.some}
                            </div>
                        )}
                    </ViewportList>
                </div>
            </Scrollable> */}
        </>
    );
};

const messages = [
    {
        displayMode: 'cozy',
        isHeadless: false,
        tabIndex: 0,
        message: {
            user: 'userId-1',
            content: JSON.stringify([{ type: 'paragraph', children: [{ text: 'amazing message 1' }] }]),
            createdAt: Date.now(),
            isChanged: false,
            updatedAt: Date.now(),
            isDeleted: false,
            attachments: [...Array(0)].map(() => 'https://via.placeholder.com/150'),
            reactions: [...Array(0)].map((_, i) => ({ 
                code: uniqueEmojiCodeList[i], 
                users: [...Array(i)].fill(i.toString()), 
            } satisfies {code: EmojiCode, users: string[]})),
            id: 'message-id-1',
            chat: 'chat-id-1',
            respondOn: [''],
        },
    },
    {
        displayMode: 'cozy',
        isHeadless: true,
        tabIndex: 0,
        message: {
            user: 'userId-2',
            content: JSON.stringify([{ type: 'paragraph', children: [{ text: 'amazing message 2' }] }]),
            createdAt: Date.now(),
            isChanged: false,
            updatedAt: Date.now(),
            isDeleted: false,
            attachments: [...Array(3)].map(() => 'https://via.placeholder.com/150'),
            reactions: [...Array(0)].map((_, i) => ({ 
                code: uniqueEmojiCodeList[i], 
                users: [...Array(i)].fill(i.toString()), 
            } satisfies {code: EmojiCode, users: string[]})),
            id: 'message-id-2',
            chat: 'chat-id-2',
            respondOn: [''],
        },
    },
    {
        displayMode: 'cozy',
        isHeadless: false,
        tabIndex: 0,
        message: {
            user: 'userId-3',
            content: JSON.stringify([{ type: 'paragraph', children: [{ text: 'amazing message 3' }] }]),
            createdAt: Date.now(),
            isChanged: false,
            updatedAt: Date.now(),
            isDeleted: false,
            attachments: [...Array(0)].map(() => 'https://via.placeholder.com/150'),
            reactions: [...Array(4)].map((_, i) => ({ 
                code: uniqueEmojiCodeList[i], 
                users: [...Array(i)].fill(i.toString()), 
            } satisfies {code: EmojiCode, users: string[]})),
            id: 'message-id-3',
            chat: 'chat-id-3',
            respondOn: [''],
        },
    },
    {
        displayMode: 'cozy',
        isHeadless: false,
        tabIndex: 0,
        message: {
            user: 'userId-4',
            content: JSON.stringify([{ type: 'paragraph', children: [{ text: 'amazing message 4' }] }]),
            createdAt: Date.now(),
            isChanged: false,
            updatedAt: Date.now(),
            isDeleted: false,
            attachments: [...Array(3)].map(() => 'https://via.placeholder.com/150'),
            reactions: [...Array(4)].map((_, i) => ({ 
                code: uniqueEmojiCodeList[i], 
                users: [...Array(i)].fill(i.toString()), 
            } satisfies {code: EmojiCode, users: string[]})),
            id: 'message-id-4',
            chat: 'chat-id-4',
            respondOn: [''],
        },
    },
    {
        displayMode: 'cozy',
        isHeadless: false,
        tabIndex: 0,
        message: {
            user: 'userId-5',
            content: JSON.stringify([{ type: 'paragraph', children: [{ text: 'amazing message 5' }] }]),
            createdAt: Date.now(),
            isChanged: true,
            updatedAt: Date.now(),
            isDeleted: false,
            attachments: [...Array(2)].map(() => 'https://via.placeholder.com/150'),
            reactions: [...Array(2)].map((_, i) => ({ 
                code: uniqueEmojiCodeList[i], 
                users: [...Array(i)].fill(i.toString()), 
            } satisfies {code: EmojiCode, users: string[]})),
            id: 'message-id-5',
            chat: 'chat-id-5',
            respondOn: [''],
        },
    },
];


const get = async(target: HTMLElement): Promise<DOMRectReadOnly> => {
    return new Promise((resolve, reject) => {
        const obs = new IntersectionObserver(([e]) => {
            resolve(e.boundingClientRect);
            obs.unobserve(target);
            // console.log('wow', e.boundingClientRect);
        });

        obs.observe(target);
    });
};

import getScrollableParent from 'scrollparent';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { useMeasure } from 'react-use';
import { useRelativePositionV2 } from 'src/hooks/useRelativePositionV2/useRelativePositionV2';
import { useFocus } from 'src/hooks/useFocus/useFocus';
import { Formik } from 'formik';
import { FormikFileUploadContextProvider } from '@libs';
import SimpleBar from 'simplebar-react';



const RelativelyPositionedV2: FC<PropsWithChildren> = ({ children }) => {
    const absoluteElementRef = useRef<HTMLDivElement | null>(null);
    const { targetRef: relativeElementRef } = useContext(RefContext) as RefContext;
    const { alignment, isRelativeInView } = useRelativePositionV2({
        preferredAlignment: 'top',
        relativeElementRef,
        absoluteElementRef,
        swappableAlignment: true,
        centered: true,
        spacing: 20,
    });

    return (
        <div className='fixed z-10' ref={absoluteElementRef}>
            {alignment}
        </div>
    );
};

const PlaygroundInner3: FC = () => {
    // console.log(twClassNames(''));
    // const { throttle } = useThrottle();

    const [getRef, { entry }] = useIntersectionObserver();
    const ref = useRef<HTMLDivElement | null>(null);
    const chRef = useRef<HTMLDivElement | null>(null);
    
    

    // useEffect(() => console.log(pos), [pos]);

    // const [q, w] = useMeasure();

    // useEffect(() => {
    //     getRef(ref.current);
    // }, [getRef]);

    // useEffect(() => {
    //     if (!entry) return;


    //     console.log(entry.boundingClientRect);
    // }, [entry]);

    // useEventListener('focusin', (e) => {
    //     // console.log(e.target);
    // });

    
    const counterRef = useRef(0);
    // useEffect(() => {
    //     if (!ref.current) return;

    //     const target = ref.current;
            
    //     const scrollableParent = getScrollableParent(target);

    //     // const loop = () => {
    //     //     counterRef.current++;
    //     //     get(target).then((v) => {
    //     //         console.log(v);
    //     //         console.log(counterRef.current);
    //     //     });
    //     //     requestAnimationFrame(loop);
    //     // };
    //     // loop();

    //     const handleScroll = throttle(() => {
    //         get(target).then((v) => {
    //             console.log('scroll', v);
    //         });
    //     }, 505);

    //     scrollableParent && scrollableParent.addEventListener('scroll', handleScroll);
        

    //     return () => {
    //         scrollableParent && scrollableParent.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);

    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <Scrollable className='h-full'>
                <RefContextProvider>
                    <div 
                        className='mt-80 bg-zinc-700' 
                        onClick={() => setIsActive((prev) => !prev)}
                    >
                        <>wow</>

                        <Conditional isRendered={isActive}>
                            <RelativelyPositionedV2>
                                
                            </RelativelyPositionedV2>
                        </Conditional>
                    </div>
                </RefContextProvider>

                <List list={messages}>
                    {(message) => (
                        // @ts-ignore
                        <Message {...message}/>
                    )}
                </List>
            </Scrollable>
        </>
    );
};


const PlaygroundInner4: FC = () => {

    return (
        <div className='w-[300px] h-[300px] bg-rose-500'>
            <Scrollable 
                className='h-full'
                direction='vertical'
            >
                <div className='bg-brand-active'>
                    <>content</>
                </div>
            </Scrollable>
        </div>
    );
};

const enabled = !!0;

export const Playground: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Conditional isRendered={!enabled}>
                {children}
            </Conditional>

            <Conditional isRendered={enabled}>
                {/* <PlaygroundInner/> */}
                {/* <PlaygroundInner2/> */}
                {/* <PlaygroundInner3/> */}
                <PlaygroundInner4/>
            </Conditional>
        </>
    );
};