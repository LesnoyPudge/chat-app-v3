import { AppSettingsModal, Button, Icon, RefContextProvider, Tooltip } from '@components';
import { useToggle } from '@hooks';
import { conditional } from '@utils';
import { FC } from 'react';
import { UserInfo } from './components';



const styles = {
    wrapper: 'flex shrink-0 mt-auto items-center h-[52px] py-0 px-2 bg-primary-400',
    button: `h-8 w-8 flex shrink-0 rounded hover:bg-hover focus-visible:bg-hover
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
                    onLeftClick={toggleVoice}
                    label='Переключить состояние микрофона'
                    pressed={isVoiceMuted}
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
                    onLeftClick={toggleSound}
                    label='Переключить состояние звука'
                    pressed={isSoundMuted}
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

            <RefContextProvider>
                <Button 
                    className={styles.button}
                    label='Открыть настройки'
                    hasPopup='dialog'
                >
                    <Icon
                        className={styles.icon}
                        iconId='settings-gear'
                    />
                </Button>

                <Tooltip 
                    preferredAligment='top'
                    dependencyList={[isSoundMuted]}
                >
                    <>Настройки</>
                </Tooltip>

                <AppSettingsModal/>
            </RefContextProvider>
        </div>
    );
};