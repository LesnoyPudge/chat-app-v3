import { AppSettingsModal, Button,SpriteImage, OverlayContextProvider, Ref, Tooltip } from '@components';
import { conditional } from '@utils';
import { FC } from 'react';
import { UserInfo } from './components';
import { useAppDispatch, useMemoSelector } from '@redux/hooks';
import { AppSelectors, AppSlice } from '@redux/features';
import { IMAGES } from '@generated';



const styles = {
    wrapper: 'flex shrink-0 mt-auto items-center h-[52px] py-0 px-2 bg-primary-400',
    button: `h-8 w-8 flex shrink-0 rounded hover:bg-primary-hover focus-visible:bg-primary-hover
    fill-icon-300 hover:fill-icon-200 focus-visible:fill-icon-200`,
    icon: 'w-5 h-5 m-auto',
};

export const UserToolBar: FC = () => {
    const isMuted = useMemoSelector((state) => AppSelectors.selectAppState(state).muted);
    const isDeaf = useMemoSelector((state) => AppSelectors.selectAppState(state).deaf);
    const { dispatch } = useAppDispatch();

    const toggleMute = () => dispatch(AppSlice.actions.toggleMute());
    const toggleDeaf = () => dispatch(AppSlice.actions.toggleDeaf());

    const voiceIconId = isMuted ? IMAGES.SPRITE.MICROPHONE_MUTED.NAME : IMAGES.SPRITE.MICROPHONE.NAME;
    const soundIconId = isDeaf ? IMAGES.SPRITE.HEADPHONE_MUTED.NAME : IMAGES.SPRITE.HEADPHONE.NAME;

    const voiceTooltip = conditional('Вкл. микрофон', 'Откл. микрофон', isMuted);
    const soundTooltip = conditional('Вкл. звук', 'Откл. звук', isDeaf);

    return (
        <div className={styles.wrapper}>
            <UserInfo/>

            <Ref<HTMLButtonElement>>
                {(ref) => (
                    <>
                        <Button
                            className={styles.button}
                            label='Переключить состояние микрофона'
                            isActive={isMuted}
                            innerRef={ref}
                            onLeftClick={toggleMute}
                        >
                            <SpriteImage
                                className={styles.icon}
                                name={voiceIconId}
                            />
                        </Button>

                        <Tooltip
                            preferredAlignment='top'
                            leaderElementRef={ref}
                        >
                            {voiceTooltip}
                        </Tooltip>
                    </>
                )}
            </Ref>

            <Ref<HTMLButtonElement>>
                {(ref) => (
                    <>
                        <Button
                            className={styles.button}
                            label='Переключить состояние звука'
                            isActive={isDeaf}
                            innerRef={ref}
                            onLeftClick={toggleDeaf}
                        >
                            <SpriteImage
                                className={styles.icon}
                                name={soundIconId}
                            />
                        </Button>

                        <Tooltip
                            preferredAlignment='top'
                            leaderElementRef={ref}
                        >
                            {soundTooltip}
                        </Tooltip>
                    </>
                )}
            </Ref>

            <OverlayContextProvider>
                {({ openOverlay, isOverlayExist }) => (
                    <Ref<HTMLButtonElement>>
                        {(ref) => (
                            <>
                                <Button
                                    className={styles.button}
                                    label='Открыть настройки'
                                    hasPopup='dialog'
                                    isActive={isOverlayExist}
                                    innerRef={ref}
                                    onLeftClick={openOverlay}
                                >
                                    <SpriteImage
                                        className={styles.icon}
                                        name='SETTINGS_GEAR'
                                    />
                                </Button>

                                <Tooltip
                                    preferredAlignment='top'
                                    leaderElementRef={ref}
                                >
                                    <>Настройки</>
                                </Tooltip>

                                <AppSettingsModal/>
                            </>
                        )}
                    </Ref>
                )}
            </OverlayContextProvider>
        </div>
    );
};