import { Button, CreateRoomModal, EntityContext, EntityContextHelpers, OverlayContextProvider } from '@components';
import { FC, useContext } from 'react';



export const AddRoom: FC = () => {
    const [channel] = useContext(EntityContext.Channel);

    return (
        <div className='mt-4 px-2'>
            <>qwe</>

            <OverlayContextProvider disabled={!channel}>
                {({ openOverlay, isOverlayExist }) => (
                    <>
                        <Button
                            className=''
                            hasPopup='dialog'
                            label='Открыть диалог создания комнаты'
                            isActive={isOverlayExist}
                            onLeftClick={openOverlay}
                        >
                            <>add</>
                        </Button>

                        <EntityContextHelpers.Channel.Loaded>
                            <CreateRoomModal/>
                        </EntityContextHelpers.Channel.Loaded>
                    </>
                )}
            </OverlayContextProvider>
        </div>
    );
};