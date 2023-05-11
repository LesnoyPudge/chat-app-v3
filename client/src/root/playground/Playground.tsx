import { Image, ChannelSettingsModal, Conditional, OverlayContextProvider, AppSettingsModal, ColorPicker, Scrollable, CreateRoomModal, InviteToChannelModal, ChildrenAsNodeOrFunction, List, SearchBar, BanMemberModal, KickMemberModal, ChangeChannelOwnerModal, BlockUserModal, AddMemberToRoleModal, DeleteRoleModal, AddFriendModal, RoomSettingsModal, FindChannelModal, EmojiPicker, uniqueEmojiCodeList, EmojiCode , Message, RefContext, RefContextProvider, Button, ModalWindow, Memo, Static } from '@components';
import { useInView } from '@react-spring/web';
import { AnyFunction, EncodedFile, PropsWithChildrenAndClassName, PropsWithChildrenAsNodeOrFunction } from '@types';
import { getHTML, noop, throttle, twClassNames , sharedResizeObserver, sharedIntersectionObserver, getEnv } from '@utils';
import { Component, createContext, CSSProperties, FC, MutableRefObject, PropsWithChildren, PureComponent, ReactNode, useCallback, useContext, useDeferredValue, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Attachments, OpenEmojiPickerButton } from 'src/components/other/MessageInputBar/components';
import { useBoolean, useCounter, useElementSize, useHover, useImageOnLoad, useInterval, useToggle, useUpdateEffect } from 'usehooks-ts';
import { VariableSizeList } from 'react-window';
import { useFileDrop, useSharedIntersectionObserver, useSharedResizeObserver, useTextInput, useThrottle, useWebWorker, useEventListener } from '@hooks';
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


import getScrollableParent from 'scrollparent';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { useLatest, useMeasure } from 'react-use';
import { useRelativePositionV2 } from 'src/hooks/useRelativePositionV2/useRelativePositionV2';
import { useFocus } from 'src/hooks/useFocus/useFocus';
import { Formik } from 'formik';
import { FormikFileUploadContextProvider } from '@libs';
import SimpleBar from 'simplebar-react';
// import { Chat } from 'src/components/other/Chat/Chat';
import { SingleEntryObserverCallback } from 'src/utils/observers/types';
import ReactFocusLock from 'react-focus-lock';
import { useUserLoginMutation, useUserRegistrationMutation } from '@redux/features';




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

                <List list={Array(99).fill(null).map((_, i) => String(i))}>
                    {(item) => (
                        <div className='h-16'>
                            {item}
                        </div>
                    )}
                </List>
            </Scrollable>
        </>
    );
};

const workerFunction = (n: number) => {
    const fibonacci = (n: number): number => {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    };

    return fibonacci(n);
};

const workerFunction2 = (n: number) => {
    const memoizedFibonacci = (() => {
        const memo: { [key: number]: number } = {};
        return (n: number): number => {
            if (n in memo) return memo[n];
            if (n <= 1) return n;
            let fib = 1;
            let prevFib = 1;
            for (let i = 2; i < n; i++) {
                const temp = fib;
                fib += prevFib;
                prevFib = temp;
            }
            memo[n] = fib;
            return memo[n];
        };
    })();

    return memoizedFibonacci(n);
};

const PlaygroundInner4: FC = () => {
    const [runWorker, result] = useWebWorker(workerFunction2);
    const [number, setNumber] = useState(1);
    
    const handleClick = () => {
        runWorker(number);
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(parseInt(event.target.value));
    };

    return (
        <div>
            <label>
                <>Calculate Fibonacci for:</>

                <input type='number' value={number} onChange={handleNumberChange} />
            </label>
            
            <button onClick={handleClick}>Calculate</button>

            {result.data && <p>The result is: {result.data}</p>}
            {result.error && <p>An error occurred: {result.error.message}</p>}
        </div>
    );
};

const PlaygroundInner5: FC = () => {
    const { count, increment } = useCounter(0);

    const [_, setTextareaRef] = useSharedResizeObserver(undefined, (entry) => {
        console.log('textarea resize');
    });
    
    const [__, setButtonRef] = useSharedResizeObserver(undefined, (entry) => {
        console.log('button resize');
    });

    const [___, setItemRef] = useSharedIntersectionObserver(undefined, (entry) => {
        console.log('int obs', entry.isIntersecting);
    });

    return (
        <div>
            <button onClick={increment} ref={setButtonRef}>
                {count}
            </button>

            <textarea 
                className='bg-lime-800 resize block'
                name='' 
                id=''
                value='wow'
                onChange={() => {}}
                ref={setTextareaRef}
            ></textarea>

            <Scrollable className='h-[500px]'>
                <div className='h-[900px]'>
                    <div ref={setItemRef}>
                        <>item</>
                    </div>
                </div>
            </Scrollable>
        </div>
    );
};

const PlaygroundInner6: FC = () => {
    const [list, setList] = useState(Array(19).fill(null).map(() => ''));

    const add = () => setList((prev) => [...prev, '']);

    useInterval(add, 500);

    const ListComponent = (
        <div className='flex flex-col gap-2'>
            {/* <List list={list}>
                
            </List> */}
            <ViewportList items={list}>
                {(_, i) => (
                    <div 
                        className='py-2'
                        onClick={add}
                        key={i}
                    >
                        <>item: {i}</>
                    </div>
                )}
            </ViewportList>
        </div>
    );

    return (
        <>
            <Conditional isRendered={true}>
                <div className='h-full relative flex'>
                    <Scrollable>
                        {ListComponent}
                    </Scrollable>
                </div>
            </Conditional>

            <Conditional isRendered={false}>
                <div className='h-full relative'>
                    <div className='absolute inset-0 overflow-y-scroll'>
                        {ListComponent}
                    </div>
                </div>
            </Conditional>

            {/* <Chat2 className='h-full'/> */}
        </>
    );
};

interface ContextValues {
    counter: number;
    inc: () => void;
    decr: () => void;
}

const PlaygroundContext = createContext<ContextValues | undefined>(undefined);

const Count: FC = () => {
    const { counter } = useContext(PlaygroundContext) as ContextValues;
    
    return (
        <div className='m-1'>
            {counter}
        </div>
    );
};

const Decr: FC = () => {
    const { decr } = useContext(PlaygroundContext) as ContextValues;
    
    return (
        <button className='m-1' onClick={decr}>
            <>decr</>
        </button>
    );
};

const Empty: FC = () => {
    return (
        <button className='m-1'>
            <>empty</>
        </button>
    );
};

const Inner: FC = () => {
    const { inc } = useContext(PlaygroundContext) as ContextValues;
    
    return (
        <>
            <Memo>
                <button className='m-1' onClick={inc}>
                    <>inc</>
                </button>
            </Memo>

            <Memo>
                <Empty/>
            </Memo>

            <Memo>
                <Count/>
            </Memo>
        </>
    );
};

const PlaygroundInner7: FC = () => {
    const { count, increment, decrement } = useCounter(0);

    const values: ContextValues = useMemo(() => ({
        counter: count,
        inc: increment,
        decr: decrement,
    }), [count]);

    return (
        <div className='flex flex-col gap-2'>
            <PlaygroundContext.Provider value={values}>
                <Memo>
                    <Decr/>
                </Memo>

                <Inner/>
            </PlaygroundContext.Provider>   
        </div>
    );
};

const PlaygroundInner8: FC = () => {    
    const apiRouteInput = useTextInput('');
    const loginInput = useTextInput('');
    const passwordInput = useTextInput('');


    const sendRequest = (endpoint: string) => {
        return fetch(`${getEnv().CUSTOM_SERVER_URL + getEnv().CUSTOM_API_V1_URL}/${endpoint}`, {
            method: 'POST',
            body: JSON.stringify({
                login: loginInput.value,
                password: passwordInput.value,
            }),
        });
    };
    const [login] = useUserLoginMutation();
    const [registration] = useUserRegistrationMutation();

    const handleClick = () => {
        // sendRequest(apiRouteInput.value).then((value) => {
        //     return value.json();
        // })
        
        registration({
            login: loginInput.value,
            password: passwordInput.value, 
            username: 'some username',
        }).then((value: any) => {
            console.log(value);
        }).catch((error) => {
            console.log(`error: ${error}`);
        });
    };

    return (
        <div className='flex flex-col'>
            <input 
                type='text' 
                value={apiRouteInput.value}
                onChange={apiRouteInput.handleChange}
            />

            <label>
                <>login</>
                
                <input 
                    type='text' 
                    value={loginInput.value}
                    onChange={loginInput.handleChange}
                />
            </label>

            <label>
                <>password</>
            
                <input 
                    type='text' 
                    value={passwordInput.value}
                    onChange={passwordInput.handleChange}
                />
            </label>

            <button onClick={handleClick}>
                send
            </button>
        </div>
    );
};

const enabled = !!1;

export const Playground: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Conditional isRendered={!enabled}>
                {children}
            </Conditional>

            <Conditional isRendered={enabled}>
                {/* <ReactFocusLock className='h-full'> */}
                {/* <PlaygroundInner/> */}
                {/* <PlaygroundInner2/> */}
                {/* <PlaygroundInner3/> */}
                {/* <PlaygroundInner4/> */}
                {/* <PlaygroundInner5/> */}
                {/* <PlaygroundInner6/> */}
                {/* <PlaygroundInner7/> */}
                <PlaygroundInner8/>
                {/* </ReactFocusLock> */}
            </Conditional>
        </>
    );
};