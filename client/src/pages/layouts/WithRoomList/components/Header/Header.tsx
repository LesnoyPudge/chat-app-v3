import { Button,SpriteImage, OverlayContextProvider, Ref, TopBar } from '@components';
import { useNavigator } from '@hooks';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { ChannelMenu } from './components';
import { IMAGES } from '@generated';



const styles = {
    topBar: {
        base: 'relative hover:bg-primary-hover focus-within:bg-primary-hover',
        acvive: 'bg-primary-hover',
    },
    button: 'flex justify-between items-center w-full h-full px-4',
    buttonText: 'font-semibold text-color-primary truncate',
    buttonIcon: 'w-4 h-4 fill-icon-100',
};

export const Header: FC = () => {
    const { params } = useNavigator();
    const channelLabel = `ch name ${params.channelId}`;

    return (
        <OverlayContextProvider>
            {({ openOverlay, isOverlayExist }) => {
                const iconId = isOverlayExist ? IMAGES.SPRITE.CROSS_ICON.NAME : IMAGES.SPRITE.DROPDOWN_ARROW_ICON.NAME;

                return (
                    <TopBar className={twClassNames(
                        styles.topBar.base,
                        { [styles.topBar.acvive]: isOverlayExist },
                    )}>
                        <Ref<HTMLButtonElement>>
                            {(ref) => (
                                <>
                                    <Button
                                        className={styles.button}
                                        label='Открыть меню канала'
                                        hasPopup='menu'
                                        isActive={isOverlayExist}
                                        innerRef={ref}
                                        onLeftClick={openOverlay}
                                    >
                                        <span className={styles.buttonText}>
                                            {channelLabel}
                                        </span>

                                        <SpriteImage
                                            className={styles.buttonIcon}
                                            name={iconId}
                                        />
                                    </Button>

                                    <ChannelMenu leaderElementRef={ref}/>
                                </>
                            )}
                        </Ref>
                    </TopBar>
                );
            }}
        </OverlayContextProvider>
    );
};