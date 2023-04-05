import { Image, ChannelSettingsModal, Conditional, OverlayContextProvider, AppSettingsModal, ColorPicker, Scrollable, CreateRoomModal, InviteToChannelModal, ChildrenAsNodeOrFunction, List, SearchBar, BanMemberModal, KickMemberModal, ChangeChannelOwnerModal, BlockUserModal, AddMemberToRoleModal, DeleteRoleModal, AddFriendModal, RoomSettingsModal, FindChannelModal, EmojiPicker, uniqueEmojiCodeList, EmojiCode , Message, RefContext, RefContextProvider, Button, ModalWindow } from '@components';
import { useInView } from '@react-spring/web';
import { AnyFunction, EncodedFile, PropsWithChildrenAndClassName, PropsWithChildrenAsNodeOrFunction } from '@types';
import { getHTML, noop, throttle, twClassNames , sharedResizeObserver, sharedIntersectionObserver } from '@utils';
import { CSSProperties, FC, MutableRefObject, PropsWithChildren, useCallback, useContext, useDeferredValue, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Attachments, OpenEmojiPickerButton } from 'src/components/other/MessageInputBar/components';
import { useBoolean, useCounter, useElementSize, useHover, useImageOnLoad, useToggle, useUpdateEffect } from 'usehooks-ts';
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
import { Chat } from 'src/components/other/Chat/Chat';
import { SingleEntryObserverCallback } from 'src/utils/observers/types';
import { Chat2 } from 'src/components/other/Chat/Chat2';
import ReactFocusLock from 'react-focus-lock';




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
    // const [isVisible, toggle] = useToggle(true);
    const ref = useRef<HTMLDivElement | null>(null);
    const [ref2, setRef2] = useState<HTMLDivElement | null>(null);
    // const [simp, setSimp] = useState<SimpleBarCore | null>(null);
    // const content = useLatest(simp?.contentEl || null);
    // const simpRef = useRef<SimpleBarCore | null>(null);

    // useSharedIntersectionObserver(simp?.contentEl, ({ isIntersecting }) => {
    //     console.log('work', isIntersecting);
    // });
    // useEventListener('click', (e) => {
    //     console.log('click');
    // }, ref2);
    // // console.log(ref.current);

    // useEffect(() => {
    //     console.log(ref.current);
    // }, []);

    // useEventListener('keydown', (e) => {
    //     console.log('key', e.key);
    // }, ref.current);

    return (
        <>
            {/* <div ref={setRef2} tabIndex={0}>
                <>test</>
            </div> */}
            {/* <Scrollable className='h-[500px]' setSimpleBar={setSimp}>
                
            </Scrollable> */}
            <Chat2 className='h-full'/>
            {/* <Test/> */}
        </>
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
                <PlaygroundInner6/>
                {/* </ReactFocusLock> */}
            </Conditional>
        </>
    );
};