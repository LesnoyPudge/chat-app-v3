import { Button, CreateRoomModal, EntityContext, EntityContextHelpers, OverlayContextProvider, Ref, SpriteImage, Tooltip } from '@components';
import { Heading } from '@libs';
import { FC, useContext } from 'react';



const styles = {
    wrapper: 'flex gap-2 justify-between mt-4 px-4',
    heading: 'font-semibold',
    button: 'fill-icon-300 focus-visible:fill-icon-100 hover:fill-icon-100',
    icon: 'w-5 h-5',
};

export const AddRoom: FC = () => {
    const [channel] = useContext(EntityContext.Channel);

    return (
        <div className={styles.wrapper}>
            <Heading className={styles.heading}>
                <>Комнаты</>
            </Heading>

            <OverlayContextProvider disabled={!channel}>
                {({ openOverlay, isOverlayExist }) => (
                    <Ref<HTMLButtonElement>>
                        {(ref) => (
                            <>
                                <Button
                                    className={styles.button}
                                    hasPopup='dialog'
                                    label='Открыть диалог создания комнаты'
                                    isActive={isOverlayExist}
                                    isDisabled={!channel}
                                    innerRef={ref}
                                    onLeftClick={openOverlay}
                                >
                                    <SpriteImage
                                        className={styles.icon}
                                        name='PLUS_ICON'
                                    />
                                </Button>

                                <Tooltip
                                    leaderElementRef={ref}
                                    preferredAlignment='right'
                                >
                                    <>Добавить комнату</>
                                </Tooltip>

                                <EntityContextHelpers.Channel.Loaded>
                                    <CreateRoomModal/>
                                </EntityContextHelpers.Channel.Loaded>
                            </>
                        )}
                    </Ref>
                )}
            </OverlayContextProvider>
        </div>
    );
};