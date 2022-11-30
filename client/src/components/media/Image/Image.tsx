import { Conditional } from '@components';
import { twClassNames } from '@utils';
import { FC, ReactNode, useEffect, useState } from 'react';
import { JSImage } from './JSImage';



interface IImage {
    wrapperClassName?: string;
    imageClassName?: string;
    src?: string;
    alt?: string;
    placeholder?: ReactNode;
    fallback?: ReactNode;
    asBackground?: boolean;
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
    wrapper: 'overflow-hidden',
    image: 'w-full h-full object-cover',
};

export const Image: FC<IImage> = ({
    wrapperClassName = '',
    imageClassName = '',
    src = 'https://picsum.photos/400',
    alt,
    placeholder = <div className='bg-yellow-400 w-full h-full'>placeholder</div>,
    fallback = <div className='bg-rose-700 w-full h-full'>error</div>,
    asBackground = false,
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
    const showFallback = !imageState.loading && imageState.error;
    const showPlaceholder = imageState.loading;

    return (
        <div className={twClassNames(styles.wrapper, wrapperClassName)}>
            <Conditional isRendered={showImage}>
                <Conditional isRendered={!asBackground}>
                    <img 
                        className={twClassNames(styles.image, imageClassName)}
                        alt={alt}
                        src={src}
                    />
                </Conditional>

                <Conditional isRendered={asBackground}>
                    <div 
                        className={twClassNames(styles.image, imageClassName)}
                        style={{ backgroundImage: `url(${src})` }}
                    ></div>
                </Conditional>
            </Conditional>

            <Conditional isRendered={showPlaceholder}>
                {placeholder}
            </Conditional>

            <Conditional isRendered={showFallback}>
                {fallback}
            </Conditional>
        </div>
    );
};