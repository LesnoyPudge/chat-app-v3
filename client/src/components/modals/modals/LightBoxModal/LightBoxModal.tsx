import { FC, useContext } from 'react';
import { Button, Link, ModalWindow, OverlayContext, Image } from '@components';
import { ModalContainer, ModalFooter } from '../../components';



interface LightBoxModal {
    src: string;
}

export const LightBoxModal: FC<LightBoxModal> = ({ src }) => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;

    return (
        <ModalWindow
            label='Изображение'
            withBackdrop
        >
            <ModalContainer className='max-h-[calc(100vh-40px)] max-w-[calc(100vw-40px)]'>
                <div onContextMenu={(e) => e.stopPropagation()}>
                    <Image
                        className='max-h-[calc(100vh-40px-48px)]'
                        src={src}
                    />
                </div>

                <ModalFooter className='gap-4 justify-between p-2 h-12'>
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