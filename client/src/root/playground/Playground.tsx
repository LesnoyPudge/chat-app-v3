import { Image, ChannelSettingsModal, Conditional, OverlayContextProvider, AppSettingsModal, ColorPicker, Scrollable, CreateRoomModal, InviteToChannelModal } from '@components';
import { EncodedFile } from '@types';
import { twClassNames } from '@utils';
import { FC, PropsWithChildren, useEffect, useReducer, useRef, useState } from 'react';
import { OpenEmojiPickerButton } from 'src/components/other/MessageInputBar/components';
import { EmojiPicker } from 'src/components/other/MessageInputBar/components/OpenEmojiPickerButton/components';
import { useEventListener, useToggle } from 'usehooks-ts';



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

    return (
        <>
            <OverlayContextProvider isOverlayExistInitial={true}>
            </OverlayContextProvider>

            <button onClick={handleClick}>click</button>

            <Scrollable className='h-full' scrollableRef={(el) => ref.current = el}>
                <div className='flex flex-col gap-5'>
                    {[...Array(60)].map((_, i) => (
                        <div key={i}>
                        wow
                        </div>
                    ))}
                </div>
            </Scrollable>


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

const enabled = !!0;

export const Playground: FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            <Conditional isRendered={!enabled}>
                {children}
            </Conditional>

            <Conditional isRendered={enabled}>
                <PlaygroundInner/>
            </Conditional>
        </>
    );
};