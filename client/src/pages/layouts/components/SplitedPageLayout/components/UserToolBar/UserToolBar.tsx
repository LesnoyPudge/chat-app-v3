import { AppSettingsModal, Button, Icon, OverlayContextProvider, RefContextProvider, Tooltip } from '@components';
import { conditional } from '@utils';
import { FC } from 'react';
import { useToggle } from 'usehooks-ts';
import { UserInfo } from './components';



const styles = {
    wrapper: 'flex shrink-0 mt-auto items-center h-[52px] py-0 px-2 bg-primary-400',
    button: `h-8 w-8 flex shrink-0 rounded hover:bg-primary-hover focus-visible:bg-primary-hover
    fill-icon-300 hover:fill-icon-200 focus-visible:fill-icon-200`,
    icon: 'w-5 h-5 m-auto',
};

export const UserToolBar: FC = () => {
    const [isVoiceMuted, toggleVoice] = useToggle(false);
    const [isSoundMuted, toggleSound] = useToggle(false);

    const voiceIconId = conditional('microphone-muted', 'microphone', isVoiceMuted);
    const soundIconId = conditional('headphone-muted', 'headphone', isSoundMuted);

    const voiceTooltip = conditional('Вкл. микрофон', 'Откл. микрофон', isVoiceMuted);
    const soundTooltip = conditional('Вкл. звук', 'Откл. звук', isSoundMuted);

    return (
        <div className={styles.wrapper}>
            <UserInfo/>

            <RefContextProvider>
                <Button 
                    className={styles.button}
                    label='Переключить состояние микрофона'
                    isActive={isVoiceMuted}
                    onLeftClick={toggleVoice}
                >
                    <Icon
                        className={styles.icon}
                        iconId={voiceIconId}
                    />
                </Button>

                <Tooltip 
                    preferredAligment='top'
                    dependencyList={[isVoiceMuted]}
                >
                    {voiceTooltip}
                </Tooltip>
            </RefContextProvider>

            <RefContextProvider>
                <Button 
                    className={styles.button}
                    label='Переключить состояние звука'
                    isActive={isSoundMuted}
                    onLeftClick={toggleSound}
                >
                    <Icon
                        className={styles.icon}
                        iconId={soundIconId}
                    />
                </Button>

                <Tooltip 
                    preferredAligment='top'
                    dependencyList={[isSoundMuted]}
                >
                    {soundTooltip}
                </Tooltip>
            </RefContextProvider>

            <OverlayContextProvider>
                {({ openOverlay, isOverlayExist }) => (
                    <>
                        <RefContextProvider>
                            <Button 
                                className={styles.button}
                                label='Открыть настройки'
                                hasPopup='dialog'
                                isActive={isOverlayExist}
                                onLeftClick={openOverlay}
                            >
                                <Icon
                                    className={styles.icon}
                                    iconId='settings-gear'
                                />
                            </Button>

                            <Tooltip preferredAligment='top'>
                                <>Настройки</>
                            </Tooltip>
                        </RefContextProvider>

                        <AppSettingsModal/>
                    </>
                )}
            </OverlayContextProvider>
        </div>
    );
};