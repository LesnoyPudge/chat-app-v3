import { FC, useContext, useEffect } from 'react';
import { Button, Link, ModalWindow, OverlayContext, Image } from '@components';
import { ModalContainer, ModalFooter } from '../../components';
import { useWindowSize } from 'usehooks-ts';
import { getDecodedImage } from '@utils';



interface LightBoxModal {
    src: string;
}

export const LightBoxModal: FC<LightBoxModal> = ({ src }) => {
    src = 'https://via.placeholder.com/3500';

    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;    
    const windowSize = useWindowSize();

    useEffect(() => {
        getDecodedImage(src).then((image) => {
            console.log(image.naturalWidth, image.naturalHeight);
        });
    }, [src]);

    return (
        <ModalWindow
            label='Изображение'
            withBackdrop
        >
            <ModalContainer className='block max-w-[calc(100vw-40px)]'>
                <div onContextMenu={(e) => e.stopPropagation()}>
                    <Image
                        src={src}
                        style={{ height: '200px' }}
                    />
                </div>

                <ModalFooter className='justify-between p-2'>
                    <Link 
                        className='text-sm'
                        href={src}
                    >
                        <>Открыть оригинал</>
                    </Link>

                    <Button
                        stylingPreset='lite'
                        size='small'
                        onLeftClick={closeOverlay}
                    >
                        <>Закрыть</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};