import { FC, useContext } from 'react';
import { Button, ChannelAvatar, Conditional, List, ModalWindow, OverlayContext, Scrollable, SearchBar, Separator } from '@components';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../components';
import { useTextInput } from '@hooks';
import { isOdd } from '@reExport';



const styles = {
    wrapper: 'w-[min(620px,100vw)]',
    content: 'h-[300px] mt-4',
    scroll: 'h-full',
    list: '',
    item: 'p-4 rounded-md hover:bg-primary-hover focus-within:bg-primary-hover',
    topRow: 'flex items-center gap-4 mb-2',
    bottomRow: 'flex items-center gap-4 flex-wrap justify-end',
    avatar: 'w-12 h-12 bg-primary-400',
    name: 'font-medium text-color-primary',
    members: 'text-color-muted text-xs',
};

export const FindChannelModal: FC = () => {
    const { closeOverlay } = useContext(OverlayContext);
    const { value, handleChange, handleReset } = useTextInput();

    const channels = [...Array(50)].map((_, i) => ({
        id: i.toString(),
        name: `some channel ${i}`,
        avatar: isOdd(i) ? null : 'https://i.pravatar.cc/80',
        members: 21950,
        online: 1945,
    }));

    const joinChannel = (id: string) => console.log('join', id);

    return (
        <ModalWindow label='Поиск каналов' withBackdrop>
            <ModalContainer className={styles.wrapper}>
                <ModalHeader>
                    <ModalTitle>
                        <>Поиск публичных каналов каналов</>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <SearchBar
                        placeholder='Введите название канала'
                        label='Поиск по названию канала'
                        value={value}
                        onChange={handleChange}
                        onReset={handleReset}
                    />

                    <div className={styles.content}>
                        <Scrollable className={styles.scroll}>
                            <ul className={styles.list}>
                                <List list={channels}>
                                    {(channel, index, arr) => {
                                        const handleJoin = () => joinChannel(channel.id);
                                        const showSeparator = index !== arr.length - 1;

                                        return (
                                            <li>
                                                <div className={styles.item}>
                                                    <div className={styles.topRow}>
                                                        <ChannelAvatar
                                                            className={styles.avatar}
                                                            avatar={channel.avatar}
                                                            name={channel.name}
                                                        />

                                                        <div className={styles.name}>
                                                            {channel.name}
                                                        </div>
                                                    </div>

                                                    <div className={styles.bottomRow}>
                                                        <div className={styles.members}>
                                                            <div>
                                                                <>Участников: </>

                                                                <strong>{channel.members}</strong>
                                                            </div>

                                                            <div>
                                                                <>В сети: </>

                                                                <strong>{channel.online}</strong>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            stylingPreset='brand'
                                                            size='medium'
                                                            onLeftClick={handleJoin}
                                                        >
                                                            <>Присоединиться</>
                                                        </Button>
                                                    </div>
                                                </div>

                                                <Conditional isRendered={showSeparator}>
                                                    <Separator spacing={8}/>
                                                </Conditional>
                                            </li>
                                        );
                                    }}
                                </List>
                            </ul>
                        </Scrollable>
                    </div>
                </ModalContent>

                <ModalFooter>
                    <Button
                        stylingPreset='brandNeutral'
                        size='medium'
                        onLeftClick={closeOverlay}
                    >
                        <>Закрыть</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};