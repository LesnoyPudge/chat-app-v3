import { Button, ModalWindow, OverlayContext, TextArea } from '@components';
import { FC, useContext } from 'react';
import { ModalContainer, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../../components';



interface KickMemberModal {
    memberId: string;
    channelId: string;
}

const styles = {
    title: 'text-base text-color-primary font-semibold',
};

export const KickMemberModal: FC<KickMemberModal> = ({
    memberId,
    channelId,
}) => {
    const { closeOverlay } = useContext(OverlayContext);
    
    const member = {
        id: memberId,
        name: 'someMember',
    };

    const handleKick = () => console.log('kick');

    return (
        <ModalWindow 
            label={`Выгнать пользователя ${memberId}`} 
            withBackdrop
        >
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle className={styles.title}>
                        <>Выгнать <strong>{member.name}</strong> с канала?</>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <div>
                        <>Вы уверены, что хотите выгнать <strong>{member.name}</strong> с сервера? </>
                        <>Он(а) сможет снова присоединиться к серверу, используя новое приглашение.</>
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
                        onLeftClick={handleKick}
                    >
                        <>Выгнать</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};