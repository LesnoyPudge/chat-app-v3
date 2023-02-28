import { Button, Image, LightBoxModal, OverlayContextProvider } from '@components';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



interface Item extends PropsWithClassName {
    imageClassName?: string;
    images: {
        src: string;
        index: number;
    }[],
    imageIndex: number;
    size?: 'rectangleSmaller' | 'square' | 'rectangle';
}

const styles = {
    button: {
        base: 'relative rounded-md overflow-hidden bg-primary-500 w-full',
        square: 'aspect-square',
        rectangle: 'aspect-[3/2]',
        rectangleSmaller: 'aspect-[550/280]',
    },
    image: 'w-full h-full',
};

export const Item: FC<Item> = ({ 
    className = '',
    imageClassName = '',
    images,
    imageIndex,
    size,
}) => {
    const image = images[imageIndex];

    const label = `Открыть вложение №${image.index}`;
    const alt = `Вложение №${image.index}`;

    return (
        <OverlayContextProvider>
            {({ openOverlay, isOverlayExist }) => (
                <>
                    <Button 
                        className={twClassNames(
                            styles.button.base, 
                            { [size ? styles.button[size] : '']: size },
                            className,
                        )}
                        label={label}
                        hasPopup='dialog'
                        isActive={isOverlayExist}
                        onLeftClick={openOverlay}
                    >
                        <Image
                            className={twClassNames(styles.image, imageClassName)}
                            src={image.src}
                            alt={alt}
                        />
                    </Button>

                    <LightBoxModal src={image.src}/>
                </>
            )}
        </OverlayContextProvider>
    );
};