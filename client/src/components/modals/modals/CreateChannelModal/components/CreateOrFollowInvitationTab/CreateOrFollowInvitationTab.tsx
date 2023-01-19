import { FC, useContext } from 'react';
import { Button, CreateChannelModalTabs, OverlayContext, TabContext } from '@components';
import { ModalHeader, ModalContent, ModalTitle, ModalSubtitle } from '../../../../components';



export const CreateOrFollowInvitationTab: FC = () => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;
    const { changeTab } = useContext(TabContext) as TabContext<CreateChannelModalTabs>;

    return (
        <>
            <ModalHeader>
                <ModalTitle>
                    <>Добавьте канал</>
                </ModalTitle>

                <ModalSubtitle>
                    <>Канал — это место, где вы можете тусоваться со своими друзьями. </>
                    <>Создайте сервер или воспользуйтесь приглашением.</>
                </ModalSubtitle>
            </ModalHeader>

            <ModalContent className='gap-2.5'>
                <Button
                    className='w-full'
                    stylingPreset='brand'
                    size='medium'
                    onLeftClick={changeTab.createChannel}
                >
                    <>Перейти к созданию</>
                </Button>

                <Button
                    className='w-full'
                    stylingPreset='brand'
                    size='medium'
                    onLeftClick={changeTab.followInvitation}
                >
                    <>Воспользуйтесь приглашением</>
                </Button>

                <Button
                    className='w-full'
                    stylingPreset='lite'
                    size='medium'
                    onLeftClick={closeOverlay}
                >
                    <>Отмена</>
                </Button>
            </ModalContent>
        </>
    );
};