import { FC, useContext } from 'react';
import { Button, ModalWindow, OverlayContext } from '@components';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../components';



interface UnbanUserModal {
    userId: string;
    channelId: string;
}

export const UnbanUserModal: FC<UnbanUserModal> = ({
    channelId,
    userId,
}) => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;

    const handleUnban = () => {
        console.log('unban');
    };

    return (
        <ModalWindow label='Разблокировать пользователя' withBackdrop>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>
                        <>Разбанить {userId}</>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <div className='uppercase text-heading-s font-medium'>
                        <>Причина бана:</>
                    </div>

                    <div className='text-sm'>
                        <>Причина не указана</>
                    </div>
                </ModalContent>

                <ModalFooter>
                    <Button
                        stylingPreset='lite'
                        size='medium'
                        onLeftClick={closeOverlay}
                    >
                        <>Отмена</>
                    </Button>

                    <Button
                        stylingPreset='brandDanger'
                        size='medium'
                        onLeftClick={handleUnban}
                    >
                        <>Разбанить</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};