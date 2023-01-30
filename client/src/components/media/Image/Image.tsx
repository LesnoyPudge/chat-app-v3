import { Conditional } from '@components';
import { EncodedFile, PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';



type OptionalValues = {
    src: string;
    file?: never;
} | {
    src?: never;
    file: EncodedFile | null;
} | {
    src: string;
    file: EncodedFile | null;
}

type Image = PropsWithClassName & OptionalValues & {
    alt?: string;
    placeholder?: ReactNode;
    fallback?: ReactNode;
}

const states = {
    initial: { 
        error: false, 
        loading: true, 
    },
    success: {
        error: false,
        loading: false,
    },
    failure: {
        error: true,
        loading: false,
    },
};

const styles = {
    image: {
        base: 'h-auto w-full max-w-full object-cover sr-only',
        active: 'not-sr-only',
        error: 'opacity-0',
    },
};

export const Image: FC<Image> = ({
    className = '',
    src,
    file,
    alt = '',
    placeholder,
    fallback,
}) => {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [imageState, setImageState] = useState(states.initial);
        
    useEffect(() => {
        if (!imageRef.current) return;
        if (!src && !file) return;
        
        const source = file ? file.base64 : (src || '');
        const image = imageRef.current;
        
        image.src = source;
    
        const handleLoad = () => setImageState(states.success);
        const handleError = () => setImageState(states.failure);

        image.addEventListener('load', handleLoad);
        image.addEventListener('error', handleError);

        return () => {
            image.removeEventListener('load', handleLoad);
            image.removeEventListener('error', handleError);
        };
    }, [src, file]);

    const showImage = (
        (!imageState.loading && !imageState.error) || 
        (!placeholder && imageState.loading) || 
        (!fallback && imageState.error)
    );
    const showPlaceholder = !showImage && imageState.loading && !!placeholder;
    const showFallback = !showImage && !imageState.loading && imageState.error && !fallback;

    return (
        <>
            <img 
                className={twClassNames(
                    styles.image.base, 
                    { 
                        [styles.image.active]: showImage,
                        [styles.image.error]: imageState.error,
                    },
                    className,
                )}
                alt={alt}
                draggable={false}
                contentEditable={false}
                ref={imageRef}
            />

            <Conditional isRendered={showPlaceholder}>
                {placeholder}
            </Conditional>

            <Conditional isRendered={showFallback}>
                {fallback}
            </Conditional>
        </>
    );
};