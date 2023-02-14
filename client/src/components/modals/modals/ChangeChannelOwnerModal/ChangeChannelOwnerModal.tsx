import { FC, useContext } from 'react';
import { Button, CheckBox, CheckBoxIndicatorSlide, ModalWindow, OverlayContext } from '@components';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../components';
import { useToggle } from 'usehooks-ts';



interface ChangeChannelOwnerModal {
    memberId: string;
    channelId: string;
}

const styles = {
    title: 'text-color-primary font-semibold',
    contentInfo: 'text-sm text-color-secondary text-center mb-5',
    highlight: 'text-color-primary',
    checkBox: 'flex gap-2 justify-between text-sm text-color-secondary',
};

export const ChangeChannelOwnerModal: FC<ChangeChannelOwnerModal> = ({
    memberId,
    channelId,
}) => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;
    const [isAgree, toggleIsAgree] = useToggle(false);

    const member = {
        id: memberId,
        name: 'someMember',
    };

    const channel = {
        id: channelId,
        name: 'coolChannel',
    };

    const handleChangeOwner = () => {
        if (!isAgree) return;
        console.log('change owner');
    };

    return (
        <ModalWindow label='Сменить владельца канала' withBackdrop>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle className={styles.title}>
                        <>Передать права на канал?</>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <div className={styles.contentInfo}>
                        <div>
                            <>Вы собираетесь передать права на владение каналом </>
                            
                            <strong className={styles.highlight}>
                                {channel.name}
                            </strong>

                            <> пользователю </>

                            <strong className={styles.highlight}>
                                {member.name}
                            </strong>

                            <>.</>
                        </div>
                        
                        <div>
                            <strong>Вы не сможете изменить своё решение!</strong>
                        </div>
                    </div>

                    <CheckBox
                        checked={isAgree}
                        label='Согласие на передачу прав'
                        name='agree'
                        onChange={toggleIsAgree}
                    >
                        <div className={styles.checkBox}>
                            <div>
                                <>Я признаю, что после передачи прав на сервер он </>
                                <>будет официально принадлежать пользователю </>
                                <strong>{member.name}</strong>
                                <>.</>
                            </div>
                            
                            <CheckBoxIndicatorSlide checked={isAgree}/>
                        </div>
                    </CheckBox>
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
                        isDisabled={!isAgree}
                        onLeftClick={handleChangeOwner}
                    >
                        <>Передать права на канал</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};