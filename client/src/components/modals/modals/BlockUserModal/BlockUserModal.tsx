import { Button, ModalWindow, OverlayContext } from '@components';
import { FC, useContext } from 'react';
import { ModalContainer, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../../components';



interface BlockUserModal {
    userId: string;
}

const styles = {
    title: 'text-color-primary font-semibold text-xl self-start',
};

export const BlockUserModal: FC<BlockUserModal> = ({
    userId,
}) => {
    const { closeOverlay } = useContext(OverlayContext);
    
    const user = {
        id: userId,
        name: 'someUser',
    };

    const handleBlock = () => console.log('block');
    
    return (
        <ModalWindow 
            label={`Заблокировать пользователя ${userId}`} 
            withBackdrop
        >
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle className={styles.title}>
                        <>Заблокировать <strong>{user.name}</strong>?</>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <div>
                        <>Вы уверены, что хотите заблокировать </>
                        <strong>{user.name}</strong>
                        <>? Блокирование этого пользователя также приведёт </>
                        <>к его удалению из вашего списка друзей.</>
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
                        onLeftClick={handleBlock}
                    >
                        <>Заблокировать</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};