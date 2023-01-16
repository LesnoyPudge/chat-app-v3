import { FC } from 'react';
import { Button, ModalWindow } from '@components';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../components';



export const LeaveChannelModal: FC = () => {
    const channelName = 'zdraste';

    return (
        <ModalWindow
            label='Покинуть канал' 
            withBackdrop
        >
            {({ closeOverlay }) => {
                const handleLeaveChannel = () => {
                    console.log('leave channel');
                    closeOverlay();
                };

                return (
                    <ModalContainer>
                        <ModalHeader>
                            <ModalTitle className='text-start text-heading-l truncated'>
                                <>Покинуть &apos;{channelName}&apos;</>
                            </ModalTitle>
                        </ModalHeader>

                        <ModalContent>
                            <p>
                                <>Вы уверены, что хотите покинуть </>
                                <strong>{channelName}</strong>
                                <>? Вы не сможете вернуться на этот сервер, пока вас снова не пригласят.</>
                            </p>
                        </ModalContent>

                        <ModalFooter>
                            <Button
                                className='font-medium'
                                stylingPreset='lite'
                                size='medium'
                                onLeftClick={closeOverlay}
                            >
                                <>Отмена</>
                            </Button>

                            <Button
                                stylingPreset='brandDanger'
                                size='medium'
                                onLeftClick={handleLeaveChannel}
                            >
                                <>Покинуть канал</>
                            </Button>
                        </ModalFooter>
                    </ModalContainer>
                );
            }}
        </ModalWindow>
    );
};