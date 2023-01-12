import { FC } from 'react';
import { Button, ModalWindow } from '@components';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../components';



export const DeleteRoomModal: FC = () => {
    const roomName = 'cool room';

    const handleDeleteRoom = () => {
        console.log('delete room');
    };

    return (
        <ModalWindow withBackdrop>
            {({ closeOverlay }) => (
                <ModalContainer>
                    <ModalHeader>
                        <ModalTitle>
                            <>Удалить комнату</>
                        </ModalTitle>
                    </ModalHeader>

                    <ModalContent>
                        <p>
                            <>Вы уверены, что хотите удалить <strong>{roomName}</strong></>
                            <>? Это действие не может быть отменено.</>
                        </p>
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
                            onLeftClick={handleDeleteRoom}
                        >
                            <>Удалить комнату</>
                        </Button>
                    </ModalFooter>
                </ModalContainer>
            )}
        </ModalWindow>
    );
};