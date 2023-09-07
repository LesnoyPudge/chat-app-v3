import { Button,SpriteImage, OverlayContextProvider, Ref, TopBar, EntityContext } from '@components';
import { useNavigator } from '@hooks';
import { getTextFallback, twClassNames } from '@utils';
import { FC, useContext } from 'react';
import { ChannelMenu } from './components';
import { IMAGES } from '@generated';



const styles = {
    topBar: {
        base: 'relative hover:bg-primary-hover focus-within:bg-primary-hover',
        active: 'bg-primary-hover',
    },
    button: 'flex justify-between items-center w-full h-full px-4',
    buttonText: 'font-semibold text-color-primary truncate',
    buttonIcon: 'w-4 h-4 fill-icon-100',
};

export const Header: FC = () => {
    const channel = useContext(EntityContext.Channel);

    return (
        <OverlayContextProvider disabled={!channel}>
            {({ openOverlay, isOverlayExist }) => {
                const iconId = (
                    isOverlayExist
                        ? IMAGES.SPRITE.CROSS_ICON.NAME
                        : IMAGES.SPRITE.DROPDOWN_ARROW_ICON.NAME
                );

                return (
                    <TopBar className={twClassNames(
                        styles.topBar.base,
                        { [styles.topBar.active]: isOverlayExist },
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
                                            {getTextFallback(channel?.name)}
                                        </span>

                                        <SpriteImage
                                            className={styles.buttonIcon}
                                            name={iconId}
                                        />
                                    </Button>

                                    <If condition={!!channel}>
                                        <ChannelMenu leaderElementRef={ref}/>
                                    </If>
                                </>
                            )}
                        </Ref>
                    </TopBar>
                );
            }}
        </OverlayContextProvider>
    );
};