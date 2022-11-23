import { Conditional } from '@components';
import { PropsWithClassName } from '@types';
import { getOneOf, twClassNames } from '@utils';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { JSImage } from './JSImage';



interface IImage extends PropsWithClassName {
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
    className = '',
    src = 'https://picsum.photos/400',
    alt,
    placeholder,
    fallback,
}) => {
    const [imageState, setImageState] = useState(states.initial);
    const [data, setData] = useState('');

    useEffect(() => {
        // fetch(src)
        //     .then(response => {
                
        //         console.log(response);
        //         return response.blob();
        //     })
        //     .then(imageBlob => {
        //     // Then create a local URL for that image and print it 
        //         const imageObjectURL = URL.createObjectURL(imageBlob);
        //         console.log('loaded', imageObjectURL);
        //         setData(imageObjectURL);
        //     }).then(handleLoad).catch(handleError);
        const handleLoad = () => {
            console.log('loaded');
            setImageState(states.success);
        };
        const handleError = () => {
            console.log('error');
            setImageState(states.failure);
        };

        const image = new JSImage();
        image.src = src;
        
        image.addEventListener('load', handleLoad);
        image.addEventListener('error', handleError);

        return () => {
            image.removeEventListener('load', handleLoad);
            image.removeEventListener('error', handleError);
        };
    }, [src]);

    const showImage = !imageState.error && !imageState.loading;
    const showFallback = imageState.error && !imageState.loading;
    const showPlaceholder = imageState.loading;

    return (
        <>
            <Conditional isRendered={showImage}>
                <img 
                    className={twClassNames('border-sky-600 border-4', className)}
                    src={src} 
                    alt={alt}
                />
            </Conditional>

            <Conditional isRendered={showPlaceholder}>
                <Conditional isRendered={!!placeholder}>
                    {placeholder}
                </Conditional>

                <Conditional isRendered={!placeholder}>
                    <div className={className}>
                        placeholder
                    </div>
                </Conditional>
            </Conditional>

            <Conditional isRendered={showFallback}>
                <Conditional isRendered={!!fallback}>
                    {fallback}
                </Conditional>

                <Conditional isRendered={!fallback}>
                    <div className={className}>
                        fallback
                    </div>
                </Conditional>
            </Conditional>
        </>
    );
};