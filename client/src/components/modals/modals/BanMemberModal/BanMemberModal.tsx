import { Button, FieldLabel, Id, ModalWindow, OverlayContext, TextArea } from '@components';
import { useTextInput } from '@hooks';
import { FC, useContext } from 'react';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../components';



interface BanMemberModal {
    memberId: string;
    channelId: string;
}

const styles = {
    title: 'text-base text-color-primary font-semibold',
};

export const BanMemberModal: FC<BanMemberModal> = ({
    memberId,
    channelId,
}) => {
    const { closeOverlay } = useContext(OverlayContext);
    const { value, handleChange } = useTextInput();

    const member = {
        id: memberId,
        name: 'someMember',
    };

    const handleBan = () => console.log('ban');

    return (
        <ModalWindow 
            label={`Забанить пользователя ${member.name}`} 
            withBackdrop
        >
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle className={styles.title}>
                        <>Хотите забанить <strong>{member.name}</strong>?</>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <Id>
                        {(id) => (
                            <>
                                <FieldLabel htmlFor={id}>
                                    <>Причина бана</>
                                </FieldLabel>

                                <TextArea
                                    id={id}
                                    value={value}
                                    maxLength={512}
                                    rows={6}
                                    placeholder='Введите причину бана или оставьте это поле пустым'
                                    onChange={handleChange}
                                />
                            </>
                        )}
                    </Id>
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
                        onLeftClick={handleBan}
                    >
                        <>Забанить</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};