import { Conditional } from '@components';
import { Placeholder } from '@libs';
import { FC, ReactNode, useEffect, useState } from 'react';
import { JSImage } from './JSImage';



interface IImage {
    wrapperClassName?: string;
    imageClassName?: string;
    src?: string;
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

export const Image: FC<IImage> = ({
    wrapperClassName = '',
    imageClassName = '',
    src = 'https://picsum.photos/400',
    alt,
    placeholder,
    fallback,
}) => {
    const [imageState, setImageState] = useState(states.initial);

    useEffect(() => {
        const handleLoad = () => setImageState(states.success);
        const handleError = () => setImageState(states.failure);

        const image = new JSImage();
        image.src = src;
        
        image.addEventListener('load', handleLoad);
        image.addEventListener('error', handleError);

        return () => {
            image.removeEventListener('load', handleLoad);
            image.removeEventListener('error', handleError);
        };
    }, [src]);

    const showImage = !imageState.loading && (!imageState.error || !fallback);
    const showFallback = !imageState.loading && imageState.error && !!fallback;
    const showPlaceholder = imageState.loading;

    return (
        <div className={wrapperClassName}>
            <Conditional isRendered={showImage}>
                <img 
                    className={imageClassName}
                    alt={alt}
                    src={src}
                />
            </Conditional>

            <Conditional isRendered={showPlaceholder}>
                <Conditional isRendered={!!placeholder}>
                    {placeholder}
                </Conditional>

                <Conditional isRendered={!placeholder}>
                    <Placeholder/>
                </Conditional>
            </Conditional>

            <Conditional isRendered={showFallback}>
                {fallback}
            </Conditional>
        </div>
    );
};