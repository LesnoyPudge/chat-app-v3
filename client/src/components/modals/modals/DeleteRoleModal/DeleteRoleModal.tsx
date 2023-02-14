import { FC, useContext } from 'react';
import { Button, ModalWindow, OverlayContext } from '@components';
import { ModalContainer, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../../components';



interface DeleteRoleModal {
    roleId: string;
}

const styles = {
    title: 'text-xl',
    content: 'text-center',
    button: 'w-full shrink',
};

export const DeleteRoleModal: FC<DeleteRoleModal> = ({
    roleId,
}) => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;
    
    const handleDelete = () => {
        console.log('handleDelete');
    };

    const role = {
        id: roleId,
        name: 'roleName',
    };

    return (
        <ModalWindow 
            label={`Удалить роль ${role.name}`} 
            withBackdrop
        >
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle className={styles.title}>
                        <>Удалить роль</>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <div className={styles.content}>
                        <>Вы уверены, что хотите удалить роль </>
                        <strong>{role.name}</strong>
                        <>? Это действие нельзя отменить.</>
                    </div>
                </ModalContent>

                <ModalFooter>
                    <Button
                        className={styles.button}
                        stylingPreset='brandNeutral'
                        size='big'
                        onLeftClick={closeOverlay}
                    >
                        <>Отмена</>
                    </Button>

                    <Button
                        className={styles.button}
                        stylingPreset='brandDanger'
                        size='big'
                        onLeftClick={handleDelete}
                    >
                        <>Удалить</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};