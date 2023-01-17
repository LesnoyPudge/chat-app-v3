import { Conditional } from '@components';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { JSImage } from './JSImage';



interface Image extends PropsWithClassName {
    src?: string;
    alt?: string;
    placeholder?: ReactNode;
    fallback?: ReactNode;
    style?: React.CSSProperties;
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

const baseClassName = 'h-auto w-full max-w-full object-cover';

export const Image: FC<Image> = ({
    className = '',
    src = 'https://picsum.photos/400',
    alt = '',
    placeholder,
    fallback,
    style,
}) => {
    const imageRef = useRef(new JSImage());
    const [imageState, setImageState] = useState(states.initial);

    useEffect(() => {
        const handleLoad = () => setImageState(states.success);
        const handleError = () => setImageState(states.failure);

        const image = imageRef.current;
        image.src = src;
        
        image.addEventListener('load', handleLoad);
        image.addEventListener('error', handleError);

        return () => {
            image.removeEventListener('load', handleLoad);
            image.removeEventListener('error', handleError);
        };
    }, [src]);

    const showImage = (
        (!imageState.loading && !imageState.error) || 
        (!placeholder && imageState.loading) || 
        (!fallback && imageState.error)
    );
    const showPlaceholder = !showImage && imageState.loading && !!placeholder;
    const showFallback = !showImage && !imageState.loading && imageState.error && !fallback;

    return (
        <>
            <Conditional isRendered={showImage}>
                <img 
                    className={twClassNames(baseClassName, className)}
                    style={style}
                    src={src} 
                    alt={alt}
                    draggable={false}
                    contentEditable={false}
                />
            </Conditional>

            <Conditional isRendered={showPlaceholder}>
                {placeholder}
            </Conditional>

            <Conditional isRendered={showFallback}>
                {fallback}
            </Conditional>
        </>
    );
};